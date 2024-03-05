import mongoose from "mongoose";
import { NotificationModel } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// {

//     postId: "61f2aa7e4b51a8954cf4629e",

//     receiverId: "61f2aa7e4b51a8954cf4629f",
//     senderId: "61f2aa7e4b51a8954cf4629d",
//     isRead: false,
//     message: "Rahda liked your post.",
//     contentType: "postLike",
//   },
//   {
//     postId: "",
//     receiverId: "61f2aa7e4b51a8954cf4629d",
//     senderId: "61f2aa7e4b51a8954cf4629e",
//     isRead: true,
//     message: "Sayed followed you.",
//     contentType: "followed",
//   },

const createNotification = asyncHandler(async (req, res) => {
  const data = req.body;
  const notification = await NotificationModel.create({
    ...data,
  });

  if (!notification) {
    throw new ApiError(400, "Failed to create notification");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, notification, "New notification received."));
});

const getNotifications = asyncHandler(async (req, res) => {
  try {
    const userIdOriginal = req.params?.id;
    //  await NotificationModel.deleteMany({});
    console.log(userIdOriginal, "userid original");
    const notifications = await NotificationModel.find({
      receiverId: new mongoose.Types.ObjectId(userIdOriginal),
    }).populate({
      path: "senderId",
      select: "avatar ",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, notifications, "Fetched all notifications."));

  } catch (error) {
    res.send({
      message: error.message
    })
  }
});

const changeNotificationStatus = async (req, res) => {
  try {
    const userId = req.user?._id;
    const result = await NotificationModel.updateMany(
      { receiverId: userId },
      {
        $set: {
          isRead: true,
        },
      }
    );
    return res
      .status(200)
      .send({ message: "notificaion status updated successfully" });
  } catch (error) {
    console.log(error, "notificaion update error");
  }
};

export { createNotification, getNotifications, changeNotificationStatus };
