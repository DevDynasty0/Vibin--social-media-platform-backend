import { Router } from "express";

import {
  createNotification,
  getNotifications,
} from "../controllers/notification.controller.js";

import { verifyToken } from "../middelwares/auth.middleware.js";const notificationRouter = Router();

notificationRouter.route("/create-notification").post(createNotification);
notificationRouter.route("/get-all-notification/:id").get(getNotifications);

export default notificationRouter;
