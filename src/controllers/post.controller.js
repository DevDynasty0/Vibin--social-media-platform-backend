import { PostModel } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createPost = async (req, res) => {
  try {
    console.log(req.body, "req body");
    const {caption, contentType, user} = req.body;
    console.log(req.file, "req");
    // get the file paths or empty strings if no files are present [nullish coalescing operator (??)]
    const postContentLocalPath = req.file?.path || "";
    const postContent = await uploadOnCloudinary(postContentLocalPath);
    console.log(postContentLocalPath, "postContentLocalPath");
    console.log(postContent, "postContent");
    // const postModel = new PostModel(body);
    // const result = await postModel.save();
    // res.status(201).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error", success: false });
  }
};

const getPosts = async (req, res) => {
  try {
    const result = await PostModel.find();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error", success: false });
  }
};

const likeToggle = async (req, res) => {
  try {
    const postId = req.params.postId;
    const existingEmail = req.body.email;
    const post = await PostModel.findById(postId);

    if (!post) {
      res.status(404).send({ error: "Document not found" });
      return;
    }

    const index = post.likes.indexOf(existingEmail);
    if (index !== -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(existingEmail);
    }
    const result = await post.save();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error", success: false });
  }
};

export { createPost, getPosts, likeToggle };
