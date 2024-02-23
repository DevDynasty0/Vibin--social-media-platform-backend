import mongoose, { Schema } from "mongoose";

// conversation body should be looks like this
//  {
//   "conversation": {
//     "participants": ["65b9e2b8e9861fa750946f50","65bb96318083d5a89f7c48a7"],
//     "lastMessage": "Hi"
//   },
//   "message": {
//     "sender": "65b9e2b8e9861fa750946f50",
//     "receiver": "65bb96318083d5a89f7c48a7",
//     "message": "Kemon achen"
//   }
// }

const conversationSchema = new Schema(
  {
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      validate: {
        validator: function (v) {
          return v.length <= 2;
        },
        message: (props) =>
          `${props.path} exceeds the maximum allowed length of 2`,
      },
      required: true,
    },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    lastMessage: {
      type: String,
      // required: true,
    },
    delPart1Msgs: {
      type: Boolean,
      default: false,
    },
    delPart2Msgs: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const ConversationModel = mongoose.model(
  "Conversation",
  conversationSchema
);
