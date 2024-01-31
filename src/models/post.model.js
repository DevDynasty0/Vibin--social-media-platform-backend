import mongoose, { Schema, ObjectId } from "mongoose";

const postSchema = new Schema(
  {
    user: {
      userId: { type: ObjectId, required: true },
      name: { type: String, required: true },
      avatar: { type: String },
    },
    post: {
      type: String,
      required: true,
    },
    postImage: {
      type: String,
    },
    likes: [String],
    share: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const PostModel = mongoose.model("Post", postSchema);
