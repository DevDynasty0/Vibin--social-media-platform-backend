import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    user : {
        userId : { type: mongoose.Schema.ObjectId, required: true },
        name : { type : String, required : true },
        avatar : { type : String },
    },
    post : {
        type : String,
        required : true
    },
    postImage : {
        type : String,
    },
    likes:{
        type: Number
    },
    share: {
        type : Number
    },
  },
  {
    timestamps: true,
  }
);


export const PostModel = mongoose.model("Post", postSchema);
