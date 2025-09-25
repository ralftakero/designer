import express from "express";
import {
  getMe,
  login,
  logout,
  firstRegister,
  secondRegister,
  verificationCode,
} from "../controllers/auth.controller.js";
import { protectedRoutes } from "../middleware/protectedRoutes.js";

const router = express.Router();

router.post("/first-register", firstRegister);
router.post("/second-register", protectedRoutes, secondRegister);
router.post("/verification-code", protectedRoutes, verificationCode);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectedRoutes, getMe);

export default router;
