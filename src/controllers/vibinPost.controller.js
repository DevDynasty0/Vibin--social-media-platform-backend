import { PostModel } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createVibinPost = async (req, res) => {
  try {
      const { caption, contentType, user,postContent:imageUrl} = req.body;
      const postContent = await uploadOnCloudinary(imageUrl);

      // console.log('sayeds body',req.body);
      const newPost = await PostModel.create({
                type:'post',
                caption,
                contentType,
                // postType,
                user,
                postContent: postContent?.url || "",
              });
              console.log('vibin post',newPost);
              return res
                .status(200)
                .send({ message: "Successfully created post.", newPost });
   

   
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server error", success: false });
  }
};
export{createVibinPost}