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

const deleteCommentsById = async (req, res) => {
  const commentId = req.params.commentId;
  const result = await CommentModel.deleteOne({ _id: commentId });
  const postData = await PostModel.findOne({ _id: req.params.postId });
  await PostModel.updateOne(
    { _id: req.params.postId },
    { comments: postData.comments - 1 }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Comment deleted successfully"));
};

// edit comment
const updateCommentById = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;

    // Find the comment by its ID and update its content
    const updatedComment = await CommentModel.findByIdAndUpdate(
      { _id: commentId },
      { comment: content },
      { new: true }
    );

    if (!updatedComment) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Comment not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
      );
  } catch (error) {
    console.error("Error updating comment:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal server error"));
  }
};

export {
  createComment,
  getCommentsByPostId,
  deleteCommentsById,
  updateCommentById,
};
