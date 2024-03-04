import { SavePostModel } from "../models/savePost.model.js";

// import { SavePostModel } from "../models/savePost.model";
const createSavePost = async (req, res) => {
    try {
    //   console.log(req.body, "req body");
      const  data = req.body;
      const newSavePost = await SavePostModel.create(data);
      console.log('savepost',newSavePost);
      const x= await SavePostModel.find({})
      console.log('xxxx',x);
      return res.status(200).send(newSavePost);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ message: "Internal server error", success: false });
    }
  };
  const getSavePost = async(req,res)=>{
    // await SavePostModel.deleteMany({})
    try{
        const userId=req.user?._id
        console.log('user id',userId);
       const savepostmodel=await SavePostModel.find({user:userId}).populate('post postOwner')
       console.log('getpostmodel',savepostmodel);
       
    if (!userId || !savepostmodel) {
        console.log('userid',userId);
        return res.status(400).send({ message: "User and post are required", success: false });
    }
        return res.status(200).send(savepostmodel)

    }catch(error){ console.log(error);
        return res
          .status(500)
          .send({ message: "Internal server error", success: false });
      }
  }
  export {createSavePost,getSavePost}



 