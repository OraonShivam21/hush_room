import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { app, server } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();
// const app = express(); // now created in socket.js file to create server for socket.io
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const originalRouter = express.Router;

express.Router = function (...args) {
  const router = originalRouter.apply(this, args);
  ["get", "post", "put", "delete", "use", "all"].forEach((method) => {
    const original = router[method];
    router[method] = function (path, ...handlers) {
      console.log(`🚩 [Router] ${method.toUpperCase()} registered:`, path);
      return original.call(this, path, ...handlers);
    };
  });
  return router;
};

["get", "post", "put", "delete", "use", "all"].forEach((method) => {
  const original = express.application[method];
  express.application[method] = function (path, ...handlers) {
    console.log(`🚩 [App] ${method.toUpperCase()} registered:`, path);
    return original.call(this, path, ...handlers);
  };
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// using the server created usng socket.io
server.listen(PORT, () => {
  console.log("===========================================");
  console.log(`Server running on http://localhost:${PORT}/api`);
  console.log("===========================================");
  connectDB();
});
