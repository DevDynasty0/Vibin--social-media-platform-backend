import mongoose, { Schema } from "mongoose";

const settingSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true
    },
    posts: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Boolean,
      default: false,
    },
    comments: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Setting = mongoose.model("Setting", settingSchema);
