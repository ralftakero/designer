import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import connMongoDb from "./db/mongodb.js";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import path from "path";

dotenv.config();
const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "https://1027-apple.com", // Replace with your frontend URL, // Ensure this is your frontend URL without a trailing slash
    methods: ["GET", "POST"],
  },
});

// Attach the io instance to the app for use in routes
app.set("socketio", io);

app.use(cors());
app.use(express.json({ limit: "36kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 4000;
const __dirname = path.resolve();

// Routes
app.use("/api/v1/rumman/auth", authRoutes);
app.use("/api/v1/rumman/user", userRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.use("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  connMongoDb();
  console.log(`Server running on port ${PORT}`);
});

















