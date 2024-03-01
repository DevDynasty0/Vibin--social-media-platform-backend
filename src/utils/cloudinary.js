import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.API_CLOUD_NAME,
  api_key: process.env.API_API_KEY,
  api_secret: process.env.API_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath,isImageUrl,imageUrl) => {
  try {
    if(isImageUrl){
      const response = await cloudinary.uploader.upload(imageUrl) 
      return response;
    }
    if (!localFilePath) return null;
    
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    return response;
  } catch (err) {
    console.log(err);
    fs.unlinkSync(localFilePath); //remove the file from server in case error while uploading
  }
};

export { uploadOnCloudinary };