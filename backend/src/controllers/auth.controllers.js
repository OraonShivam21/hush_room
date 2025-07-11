import bcrypt from "bcryptjs";

import User from "../models/user.models.js";
import { generateToken, sendJsonResponse } from "../lib/helper.js";
import cloudinary from "../lib/cloudinary.js";

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return sendJsonResponse(res, 400, { message: "Invalid credentials!" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return sendJsonResponse(res, 400, { message: "Invalid credentials!" });

    generateToken(user._id, res);

    sendJsonResponse(res, 200, {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      image: user.image,
    });
  } catch (error) {
    console.log("Error loging in:", error);
    sendJsonResponse(res, 500, error);
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    sendJsonResponse(res, 200, { message: "Logged out successfully!" });
  } catch (error) {
    console.log("Error logging out:", error);
    sendJsonResponse(res, 500, error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { image } = req.body;
    const userId = req.user._id;

    if (!image)
      return sendJsonResponse(res, 404, {
        message: "Profile pic is required!",
      });

    const uploadResponse = await cloudinary.uploader.upload(image);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        image: uploadResponse.secure_url,
      },
      { new: true }
    );

    sendJsonResponse(res, 200, updatedUser);
  } catch (error) {
    console.log("Error upating profile:", error);
    sendJsonResponse(res, 500, error);
  }
};

export const checkAuth = (req, res) => {
  try {
    sendJsonResponse(res, 200, req.user);
  } catch (error) {
    console.log("Error checking auth:", error);
    sendJsonResponse(res, 500, error);
  }
};
