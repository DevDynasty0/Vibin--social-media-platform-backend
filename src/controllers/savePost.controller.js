// import { SavePostModel } from "../models/savePost.model";
const createSavePost = async (req, res) => {
    try {
      console.log(req.body, "req body");
      const { user, post } = req.body;
      
      
      const newSavePost = await SavePostModel.create({
       user,
       post,
      });
      console.log(newSavePost);
      
    
      return res.status(200).send(newSavePost);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ message: "Internal server error", success: false });
    }
  };
  export {createSavePost}