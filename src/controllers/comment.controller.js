import { CommentModel } from "../models/comment.model.js";
import { PostModel } from "../models/post.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createComment = async (req, res) => {
  const postData = await PostModel.findOne({ _id: req.body.postId });
  const result = await CommentModel.create(req.body);
  if (result?._id && postData?._id) {
    const createdComment = await CommentModel.findOne({
      _id: result._id,
    }).populate("user");
    await PostModel.updateOne(
      { _id: result.postId },
      { comments: postData.comments + 1 }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, createdComment, "Created comment success."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Created comment filed!"));
};

const getCommentsByPostId = async (req, res) => {
  const postId = req.params.postId;
  const result = await CommentModel.find({ postId })
    .populate("user")
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Comments fetched successfully"));
};

export { createComment, getCommentsByPostId };
