import express from "express";
import { auth } from "../middlewares/auth.middlewares.js";
import {
  getMessages,
  listUsers,
  sendMessage,
} from "../controllers/message.controllers.js";

const router = express.Router();

router.get("/users", auth, listUsers);

router.get("/:id", auth, getMessages);

router.post("/send", auth, sendMessage);

export default router;
