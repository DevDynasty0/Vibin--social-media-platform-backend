import { Router } from "express";
import {
  createPost,
  createPostShare,
  deletePost,
  getPosts,
  getPostsFIds,
  likeToggle,
} from "../controllers/post.controller.js";
import { upload } from "../middelwares/multer.middleware.js";
import { verifyToken } from "../middelwares/auth.middleware.js";

const postRouter = Router();

postRouter
  .route("/post")
  .post(verifyToken, upload.single("postContent"), createPost);
postRouter
  .route("/create-post-share/:postId")
  .patch(verifyToken, createPostShare);
postRouter.route("/delete-post/:postId").delete(verifyToken, deletePost);
postRouter.route("/get-followings-posts").get(verifyToken, getPostsFIds);
postRouter.route("/get-posts/:userId").get(getPosts);
postRouter.route("/like/:postId").patch(verifyToken, likeToggle);

export default postRouter;
