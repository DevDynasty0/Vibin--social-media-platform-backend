import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/vibinDB`
    );
    console.log(
      `\n MONGODB Connected!! DB HOST: ${connectionInstance.connection.host}`
    );
    // console.log("connection Instance:", connectionInstance);
  } catch (error) {
    console.log("MONGODB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
