import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controllers.js";
import { auth } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", auth, updateProfile);

router.get("/check", auth, checkAuth);

export default router;
