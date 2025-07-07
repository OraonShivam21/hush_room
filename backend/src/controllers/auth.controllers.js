import bcrypt from "bcryptjs";

import User from "../models/user.models.js";
import { generateToken, sendJsonResponse } from "../lib/helper.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return sendJsonResponse(res, 400, {
        message: "Full Name, Email, and Password not found",
      });
    }

    if (password.length < 6) {
      return sendJsonResponse(res, 400, {
        message: "Password must be atleast 6 characters",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return sendJsonResponse(res, 400, { message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedpassword,
    });

    if (!newUser) {
      return sendJsonResponse(res, 400, { message: "Invalid user data" });
    }

    // generate jwt token
    generateToken(newUser._id, res);
    await newUser.save();

    sendJsonResponse(res, 201, {
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      image: newUser.image,
    });
  } catch (error) {
    console.log("Error signing up:", error);
    sendJsonResponse(res, 500, error);
  }
};

export const login = (req, res) => {
  res.send("login");
};
export const logout = (req, res) => {
  res.send("logout");
};
