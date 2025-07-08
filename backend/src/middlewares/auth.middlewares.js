import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import { sendJsonResponse } from "../lib/helper.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token)
      return sendJsonResponse(res, 401, {
        message: "Unauthorized - no token provided!",
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return sendJsonResponse(res, 401, {
        message: "Unauthorized - token is invalid!",
      });

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return sendJsonResponse(res, 404, { message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("Error authorizing:", error);
    sendJsonResponse(res, 500, { message: "Internal Server Error" });
  }
};
