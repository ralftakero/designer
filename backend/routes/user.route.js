import express from "express";
import {
  changePage,
  changeSituation,
  deletAlluser,
  deleteUser,
  getAllUser,
  getConnects,
  getVisits,
} from "../controllers/user.controller.js";
import { protectedRoutes } from "../middleware/protectedRoutes.js";

const router = express.Router();

router.get("/all-user", protectedRoutes, getAllUser);
router.get("/visits", protectedRoutes, getVisits);
router.get("/connects", protectedRoutes, getConnects);
router.post("/situation/:userId", protectedRoutes, changeSituation);
router.post("/page/:userId/:pageName", protectedRoutes, changePage);
router.delete("/delete/:userId", protectedRoutes, deleteUser);
router.delete("/", deletAlluser);

export default router;
