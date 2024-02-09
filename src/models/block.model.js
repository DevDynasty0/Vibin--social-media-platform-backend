import mongoose, { Schema } from "mongoose";

const blockSchema = new Schema(
  {
    blockedPerson: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    blockedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Block = mongoose.model("Block", blockSchema);