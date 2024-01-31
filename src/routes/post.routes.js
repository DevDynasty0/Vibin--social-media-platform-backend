import { Router } from "express";
import {
  createPost,
  getPosts,
  likeToggle,
} from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.route("/post").post(createPost);
postRouter.route("/posts").get(getPosts);
postRouter.route("/like/:postId").patch(likeToggle);

export default postRouter;
