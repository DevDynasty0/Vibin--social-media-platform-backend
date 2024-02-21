import mongoose, { Schema } from "mongoose";
const savePostSchema = new Schema(
    {
      postOwner: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      post:{
        type:Schema.Types.ObjectId,
        ref:"Post"
      },
      postContent: {
        type: String,
      },
      
    },
    {
timestamps:true,
    }

);
export const SavePostModel = mongoose.model("SavePost", savePostSchema);