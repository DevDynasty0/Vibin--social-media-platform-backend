import { Schema, model } from "mongoose";

const shareSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    reactions: [
      {
        type: {
          type: String,
          enum: ["love", "unlike", "vibe boost", "funny", "awkward"],
        },
        user: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    shares: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const SharePostModel = model("SharePost", shareSchema);
export default SharePostModel;
