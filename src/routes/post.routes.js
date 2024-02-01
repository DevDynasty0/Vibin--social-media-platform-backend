import { Router } from "express";
import {
  createPost,
  getPosts,
  likeToggle,
} from "../controllers/post.controller.js";
import { upload } from "../middelwares/multer.middleware.js";

const postRouter = Router();

postRouter.route("/post").post(
//     upload.fields([
//     {
//       name: "postContent",
//       maxCount: 1,
//     },
//   ]),
 upload.single("postContent"),
  createPost);
postRouter.route("/get-posts").get(getPosts);
postRouter.route("/like/:postId").patch(likeToggle);

export default postRouter;
