import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { app, server } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();
// const app = express(); // now created in socket.js file to create server for socket.io
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/api", (req, res) => {
  res.send("hello world! from hush_room api");
});

// using the server created usng socket.io
server.listen(PORT, () => {
  console.log("===========================================");
  console.log(`Server running on http://localhost:${PORT}/api`);
  console.log("===========================================");
  connectDB();
});
