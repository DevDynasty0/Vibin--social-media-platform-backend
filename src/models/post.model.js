import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    caption: {
      type: String,
      required: true,
    },
    postContent: {
      type: String,
    },
    contentType: {
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
