import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
  // postId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Post",
  // },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
});

export const NotificationModel = mongoose.model(
  "Notification",
  notificationSchema
);
