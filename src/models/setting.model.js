import mongoose, { Schema } from "mongoose";

const settingSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true
    },
    posts: {
      type: Boolean,
      default: true,
    },
    likes: {
      type: Boolean,
      default: true,
    },
    comments: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Setting = mongoose.model("Setting", settingSchema);
