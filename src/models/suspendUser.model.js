import mongoose, { Schema } from "mongoose";

const suspendUserSchema = new Schema(
  {
    normalUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const SuspendUser = mongoose.model("SuspendUser", suspendUserSchema);
