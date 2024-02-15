import { Router } from "express";

import {
  createNotification,
  getNotifications,
} from "../controllers/notification.controller";

const notificationRouter = Router();

notificationRouter.route("/create-notification").post(createNotification);
notificationRouter.route("/get-all-notification").get(getNotifications);

export default notificationRouter;
