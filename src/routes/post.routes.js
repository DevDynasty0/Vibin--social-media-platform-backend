import { Router } from "express";
import {
  addReaction,
  createPost,
  deletePost,
  getPosts,
  getPostsFIds,
} from "../controllers/post.controller.js";
import { upload } from "../middelwares/multer.middleware.js";
import { verifyToken } from "../middelwares/auth.middleware.js";
import {
  createSavePost,
  getSavePost,
} from "../controllers/savePost.controller.js";

const postRouter = Router();
postRouter
  .route("/post")
  .post(verifyToken, upload.single("postContent"), createPost);
postRouter.route("/delete-post/:postId").delete(verifyToken, deletePost);
postRouter.route("/get-followings-posts").get(verifyToken, getPostsFIds);
postRouter.route("/get-posts/:userId").get(verifyToken, getPosts);
postRouter.route("/reaction/:postId").patch(verifyToken, addReaction);
postRouter.route("/savePost/:postId").patch(verifyToken, createSavePost);
postRouter.route("/savePost").post(verifyToken, createSavePost);
postRouter.route("/getSavePost").get(verifyToken, getSavePost);

export default postRouter;
