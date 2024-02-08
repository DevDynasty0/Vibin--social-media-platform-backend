import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
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
