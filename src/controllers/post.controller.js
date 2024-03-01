import { Following } from "../models/follow.model.js";
import { PostModel } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createPost = async (req, res) => {
  try {
    const { caption, contentType, user, postType, type, post, postId } =
      req.body;
    // get the file paths or empty strings if no files are present [nullish coalescing operator (??)]
    const postContentLocalPath = req.file?.path || "";
    const postContent = await uploadOnCloudinary(postContentLocalPath);

    if (type === "post") {
      const newPost = await PostModel.create({
        type,
        caption,
        contentType,
        postType,
        user,
        postContent: postContent?.url || "",
      });
      return res
        .status(200)
        .send({ message: "Successfully created post.", newPost });
    }
    if (type === "shared") {
      const newPost = await PostModel.create({
        type,
        post,
        user,
      });
      await PostModel.updateOne(
        { _id: postId || post },
        { $inc: { shares: 1 } }
      );
      return res.status(200).send({ message: "Post shared success.", newPost });
    }
    return res
      .status(200)
      .send({ message: "Internal server error", success: false });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server error", success: false });
  }
};

const getPosts = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).send("User ID not available in the request.");
  }

  try {
    const postResults = await PostModel.find({
      user: userId,
    })
      .populate("user")
      .populate({ path: "post", populate: { path: "user", model: "User" } })
      .populate("reactions.user")
      .sort({ createdAt: -1 });

    return res.status(200).json(postResults);
  } catch (error) {
    return res.status(500).send("I am already died");
  }
};

const getPostsFIds = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(400).send("User ID not available in the request.");
  }

  try {
    const followings = await Following.find({ follower: userId })
      .populate("profile")
      .exec();

    const followingIds = followings.map((f) => f.profile?._id);
    followingIds.push(userId);

    const results = await PostModel.find({
      user: { $in: followingIds },
    })
      .populate("user")
      .populate({ path: "post", populate: { path: "user", model: "User" } })
      .populate("reactions.user")
      .sort({ createdAt: -1 });
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

const addReaction = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user?._id;

    if (!req.body.type) {
      await PostModel.findOneAndUpdate(
        { _id: postId, "reactions.user": userId },
        { $pull: { reactions: { user: userId } } }
      );

      return res.status(200).send({ message: "Remove reaction" });
    }

    const existingReaction = await PostModel.findOneAndUpdate(
      {
        _id: postId,
        "reactions.user": userId,
        "reactions.type": req.body.type,
      },
      { $set: { "reactions.$.type": req.body.type } },
      { new: true }
    );

    if (existingReaction) {
      return res.status(200).send(existingReaction);
    } else {
      await PostModel.findOneAndUpdate(
        { _id: postId, "reactions.user": userId },
        { $pull: { reactions: { user: userId } } },
        { new: true }
      );

      await PostModel.findByIdAndUpdate(
        postId,
        { $push: { reactions: { type: req.body.type, user: userId } } },
        { new: true, upsert: true }
      );
    }

    return res.status(200).send({ message: "post react added!" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", success: false });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    // console.log('postiiihhhggh',postId);
    const result = await PostModel.deleteOne({
      _id: postId,
      // "user.userId": req.user?._id,
    });
    // console.log('post delete',result);
    if (result.deletedCount === 0) {
      // No post was deleted, return 404 Not Found
      return res.status(404).json({ error: "Post not found" });
    }
    return res
      .status(200)
      .send({ message: "delete succefully", success: true, result });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server error", success: false });
  }
};

export { createPost, getPosts, deletePost, getPostsFIds, addReaction };
