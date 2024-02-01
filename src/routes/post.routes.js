import { Router } from "express";
import {
  createPost,
  deletePost,
  getPosts,
  getPostsFIds,
  likeToggle,
} from "../controllers/post.controller.js";
import { verifyToken } from "../middelwares/auth.middleware.js";

const postRouter = Router();

postRouter.route("/create-post").post(createPost);
postRouter.route("/delete-post/:postId").delete(verifyToken, deletePost);
postRouter.route("/posts-by-userId").get(verifyToken, getPosts);
postRouter.route("/get-followings-posts").get(verifyToken, getPostsFIds);
postRouter.route("/like/:postId").patch(verifyToken, likeToggle);

export default postRouter;
