import { Following } from "../models/follow.model.js";
import { PostModel } from "../models/post.model.js";
import SharePostModel from "../models/share.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createPost = async (req, res) => {
  try {
    const { caption, contentType, user, postType } = req.body;

    // get the file paths or empty strings if no files are present [nullish coalescing operator (??)]
    const postContentLocalPath = req.file?.path || "";
    const postContent = await uploadOnCloudinary(postContentLocalPath);
    const newPost = await PostModel.create({
      caption,
      contentType,
      postType,
      user,
      postContent: postContent?.url || "",
    });

    // const postModel = new PostModel(body);
    // const result = await PostModel.save();
    // res.status(201).send(result);
    return res.status(200).send(newPost);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server error", success: false });
  }
};

const createPostShare = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;
    const sharePost = await SharePostModel.create({
      post: postId,
      user: userId,
    });
    const findPost = await PostModel.findOne({ _id: postId });
    await PostModel.updateOne({ _id: postId }, { shares: findPost.shares + 1 });

    res.status(200).send(sharePost);
  } catch (error) {
    res.status(500).send({ message: "Internal server error", success: false });
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
      .sort({ createdAt: -1 })
      .populate("user");
    const sharePostResults = await SharePostModel.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .populate("user")
      .populate({ path: "post", populate: { path: "user", model: "User" } });
    // Merge the results of both queries into a single array
    const combinedResults = [...postResults, ...sharePostResults];

    // Sort the combined array based on timestamps
    combinedResults.sort((a, b) => {
      const timestampA = a.createdAt || a.createdAt;
      const timestampB = b.createdAt || b.createdAt;
      return new Date(timestampB) - new Date(timestampA);
    });

    return res.status(200).json(combinedResults);
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

    const followingIds = followings.map((f) => f.profile?._id);
    followingIds.push(userId);

    const results = await PostModel.find({
      user: { $in: followingIds },
    })
      .populate("user")
      .sort({ createdAt: -1 });

    const sharePostResult = await SharePostModel.find({
      user: { $in: followingIds },
    })
      .populate("user")
      .populate({ path: "post", populate: { path: "user", model: "User" } })
      .sort({ createdAt: -1 });
    // Merge the results of both queries into a single array
    const combinedResults = [...results, ...sharePostResult];

    // Sort the combined array based on timestamps
    combinedResults.sort((a, b) => {
      const timestampA = a.createdAt || a.createdAt;
      const timestampB = b.createdAt || b.createdAt;
      return new Date(timestampB) - new Date(timestampA);
    });

    return res.status(200).json(combinedResults);
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

export {
  createPost,
  getPosts,
  likeToggle,
  deletePost,
  getPostsFIds,
  createPostShare,
};
