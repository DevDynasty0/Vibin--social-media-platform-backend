import { Router } from "express";
import {
  createComment,
  deleteCommentsById,
  getCommentsByPostId,
  updateCommentById,
} from "../controllers/comment.controller.js";
const commentRouter = Router();

commentRouter.route("/comment").post(createComment);
commentRouter.route("/comment/:postId").get(getCommentsByPostId);
commentRouter.route("/comment/:commentId/:postId").delete(deleteCommentsById);
commentRouter.route("/comment/:commentId").patch(updateCommentById);

export default commentRouter;
