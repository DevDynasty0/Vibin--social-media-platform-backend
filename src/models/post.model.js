import mongoose, { Schema, ObjectId } from "mongoose";

const postSchema = new Schema(
  {
    user: {
      userId: { type: ObjectId, required: true },
      fullName: { type: String, required: true },
      avatar: { type: String },
    },
    caption: {
      type: String,
      required: true,
    },
    postContent: {
      type: String
    },
    contentType: {
      type: String
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
