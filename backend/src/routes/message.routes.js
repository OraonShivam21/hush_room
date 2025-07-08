import express from "express";
import { auth } from "../middlewares/auth.middlewares";
import {
  getMessages,
  listUsers,
  sendMessage,
} from "../controllers/message.controllers";

const router = express.Router();

router.get("/users", auth, listUsers);

router.get("/:id", auth, getMessages);

router.post("/send", auth, sendMessage);

export default router;
