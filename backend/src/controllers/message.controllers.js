import cloudinary from "../lib/cloudinary.js";
import { sendJsonResponse } from "../lib/helper.js";
import Message from "../models/message.models.js";
import User from "../models/user.models.js";

export const listUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    sendJsonResponse(res, 200, filteredUsers);
  } catch (error) {
    console.log("Error listing users:", error);
    sendJsonResponse(res, 500, error);
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        {
          receiverId: receiverId,
          senderId: senderId,
        },
        {
          receiverId: senderId,
          senderId: receiverId,
        },
      ],
    });

    sendJsonResponse(res, 200, messages);
  } catch (error) {
    console.log("Error getting messages:", error);
    sendJsonResponse(res, 500, error);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = "";
    if (image) {
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // realtime funcationlity

    sendJsonResponse(res, 201, newMessage);
  } catch (error) {
    console.log("Error sending message:", error);
    sendJsonResponse(res, 500, error);
  }
};
