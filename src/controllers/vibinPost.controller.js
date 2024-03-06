



const createVibinPost = async (req, res) => {
    try {
        const { caption, contentType, user, postType,postContent:imageUrl} = req.body;
        const postContent = await uploadOnCloudinary(imageUrl);

        console.log('sayeds body',req.body,postContent);
        const newPost = await PostModel.create({
                  type:'post',
                  caption,
                  contentType,
                  postType,
                  user,
                  postContent: postContent?.url || "",
                });
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