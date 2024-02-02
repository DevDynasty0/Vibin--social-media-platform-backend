import { Following } from "../models/follow.model.js";
import { PostModel } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createPost = async (req, res) => {
  try {
    console.log(req.body, "req body");
    const { caption, contentType, user } = req.body;
    // console.log(req.file, "req");
    // get the file paths or empty strings if no files are present [nullish coalescing operator (??)]
    const postContentLocalPath = req.file?.path || "";
    const postContent = await uploadOnCloudinary(postContentLocalPath);
    // console.log(postContentLocalPath, "postContentLocalPath");
    console.log(postContent, "postContent cloudinary");
    const newPost = await PostModel.create({
      caption,
      contentType,
      user: {
        userId: user.userId,
        fullName: user.fullName,
        avatar: user.avatar,
      },
      postContent: postContent?.url || "",
    });
    console.log(newPost);
    // const postModel = new PostModel(body);
    // const result = await PostModel.save();
    // res.status(201).send(result);
    return res.status(200).send(newPost);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Internal server error", success: false });
  }
};

const getPosts = async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(400).send("User ID not available in the request.");
  }

  try {
    const result = await PostModel.find({
      "user.userId": userId,
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
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

    if (!followings || followings.length === 0) {
      return res.status(200).json([]);
    }

    const followingIds = followings.map((f) => f.profile?._id);
    followingIds.push(userId);

    const result = await PostModel.find({
      "user.userId": { $in: followingIds },
    }).sort({ createdAt: -1 });

    // const result = await PostModel.aggregate([
    //   {
    //     $match: {
    //       $and: [
    //         { "user.userId": { $in: followingIds } },
    //         { "user.userId": new new mongoose.Types.ObjectId(userId)() },
    //       ],
    //     },
    //   },
    // ]);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

const likeToggle = async (req, res) => {
  try {
    const postId = req.params.postId;
    const existingEmail = req.user?.email;
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

const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const result = await PostModel.deleteOne({
      _id: postId,
      "user.userId": req.user?._id,
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Internal server error", success: false });
  }
};

export { createPost, getPosts, likeToggle, deletePost, getPostsFIds };
