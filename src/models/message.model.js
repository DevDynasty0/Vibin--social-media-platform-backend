import mongoose, { Schema, ObjectId } from "mongoose";

const messageSchema = new Schema(
  {
    conversationId: {
      type: ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    sender: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    delPart1Msg: {
      type: Boolean,
      default: false,
    },
    delPart2Msg: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model("Message", messageSchema);
