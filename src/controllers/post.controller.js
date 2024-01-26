import { PostModel } from "../models/post.model.js";

const createPost = async (req, res) => {
  try {
    const body = req.body
    const postModel = new PostModel(body);
    const result = await postModel.save();
    res.status(201).send(result);
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

export { createPost , getPosts };
