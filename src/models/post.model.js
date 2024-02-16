import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    realUser:{
      
        type: Schema.Types.ObjectId,
        ref: "User"
      
    },
    caption: {
      type: String,
      // required: true,
    },
    postContent: {
      type: String,
    },
    contentType: {
      type: String,
    },
    likes: [String],
    shares: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const PostModel = mongoose.model("Post", postSchema);
