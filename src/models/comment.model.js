import { Schema, model, ObjectId } from "mongoose";

const commentSchema = new Schema(
  {
    postId: {
      type: ObjectId,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const CommentModel = model("Comment", commentSchema);
