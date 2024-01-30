import { CommentModel } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createComment = async (req, res) => {
  const result = await CommentModel.create(req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Created comment success."));
};

const getCommentsByPostId = async (req, res) => {
  const postId = req.params.postId;
  const result = await CommentModel.find({ postId });
  console.log(result);
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
};

export { createComment, getCommentsByPostId };
