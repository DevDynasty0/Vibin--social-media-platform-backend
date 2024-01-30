import { Router } from "express";
import {
  createComment,
  getCommentsByPostId,
} from "../controllers/comment.controller.js";
const commentRouter = Router();

commentRouter.route("/comment").post(createComment);
commentRouter.route("/comment/:postId").get(getCommentsByPostId);

export default commentRouter;
