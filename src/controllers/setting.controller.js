import { Block } from "../models/block.model.js";
import { Following } from "../models/follow.model.js";
import { Setting } from "../models/setting.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const updateSetting = async (req, res) => {
  try {
    const data = req.body;
    const findUserSetting = await Setting.findOne({
      userEmail: req.params.userEmail,
    });
    if (findUserSetting) {
      const updateUserSetting = await Setting.findOneAndUpdate(
        { userEmail: req.params.userEmail },
        { $set: { ...data } },
        { new: true }
      );
      console.log(updateUserSetting, "Updated successfully");

      return res
        .status(200)
        .send({
          message: "Setting updated successfully",
          data: updateUserSetting,
        });
    } else {
      const newSetting = await Setting.create(data);
      return res
        .status(201)
        .send({ message: "New setting created", data: newSetting });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};


const getSetting = async (req, res) => {
  try {
    const userSettingRes = await Setting.findOne(
      { userEmail: req.params.userEmail },
      { posts: 1, likes: 1, comments: 1, _id: 0 }
    );
    
    return res.status(200).send(userSettingRes);
    
  } catch (error) {
    return res.status(500).send(error);
  }

  
};

const unFollowUser = async (req, res) => {
  const { profile, follower } = req.body;

  if (!(follower || profile)) {
    throw new ApiError(401, "Both follower and profile id required.");
  }

  const deleteFollow = await Following.deleteOne({ follower, profile });
  console.log(deleteFollow);
  return res
    .status(200)
    .json(new ApiResponse(200, deleteFollow, "unfollowed successfully"));
};


const blockUser = async (req, res) => {
  try {
    const { blockedPerson, blockedBy } = req.body;

    const blockedUserRes = await Block.create({ blockedPerson, blockedBy });

    console.log(blockedUserRes, "Blocked user"); 
    
    if(blockedUserRes?._id){
      const deleteFollow = await Following.deleteOne({ follower:blockedBy, profile:blockedPerson });
    console.log(deleteFollow);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, blockedUserRes, "blocked successfully"));
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const getBlockedUsers = async (req, res) => {
 try {
  const blockedUsers = await Block.find({ blockedBy: req.params.userId })
  .populate("blockedPerson")
    .exec();
    console.log(blockedUsers);
  return res
    .status(200)
    .json(new ApiResponse(200, blockedUsers, "Fetched users blocked"));
 } catch (error) {
  console.log(error);
 }
};

const unBlockUser = async (req, res) => {
  const { blockedPerson, blockedBy } = req.body;

  if (!(blockedPerson || blockedBy)) {
    throw new ApiError(401, "Both blockedPerson and blockedBy id required.");
  }

  const unBlockRes = await Block.deleteOne({ blockedPerson, blockedBy });
  console.log(unBlockRes);
  return res
    .status(200)
    .json(new ApiResponse(200, unBlockRes, "Unblock successfully"));
};

export { updateSetting, getSetting, unFollowUser, blockUser, getBlockedUsers, unBlockUser };
