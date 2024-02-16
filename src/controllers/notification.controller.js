import { NotificationModel } from "../models/notification.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// {
////// if notification is  related to post then postid is nedded
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
  const notifications = await NotificationModel.find({
    receiverId: req.user?._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, notifications, "Fetched all notifications."));
});

export { createNotification, getNotifications };