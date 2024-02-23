import { Router } from "express";

import {
  changeNotificationStatus,
  createNotification,
  getNotifications,
} from "../controllers/notification.controller.js";

import { verifyToken } from "../middelwares/auth.middleware.js";const notificationRouter = Router();

notificationRouter.route("/create-notification").post(verifyToken, createNotification);
notificationRouter.route("/get-all-notification/:id").get(verifyToken,getNotifications);
notificationRouter.route("/change-notication-status").patch(verifyToken, changeNotificationStatus);

export default notificationRouter;
