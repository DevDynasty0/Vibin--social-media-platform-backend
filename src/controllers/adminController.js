import { PostModel } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    return res.status(200).json(new ApiResponse(200, allUsers, "all users"));
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const totalPostsCount = async (req, res) => {
  try {
    const totalPosts = await PostModel.countDocuments();
    return res
      .status(200)
      .json(new ApiResponse(200, totalPosts, "Total posts"));
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

export { getAllUsers, totalPostsCount };
