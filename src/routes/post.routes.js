import { Router } from "express";
import { createPost, getPosts } from "../controllers/post.controller.js";

const postRouter = Router();


postRouter.route("/create-post").post(createPost);
postRouter.route("/get-posts").get(getPosts);



export default postRouter;
