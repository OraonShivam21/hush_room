import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api", (req, res) => {
  res.send("hello world! from hush_room api");
});

app.listen(PORT, () => {
  console.log("===========================================");
  console.log(`Server running on http://localhost:${PORT}/api`);
  console.log("===========================================");
  connectDB();
});
