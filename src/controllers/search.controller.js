import { PostModel } from "../models/post.model.js";
import { User } from "../models/user.model.js";

const getSearchResult = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      fullName: { $regex: new RegExp(query, "i") },
    }).select("-password -refreshToken");

    const posts = await PostModel.find({
      caption: { $regex: new RegExp(query, "i") },
    }).select("-password -refreshToken");

    return res.status(200).send({ users, posts });
  } catch (error) {
    return res
      .status(500)
      .send({ success: "failed to get search result!", error });
  }
};

export { getSearchResult };
