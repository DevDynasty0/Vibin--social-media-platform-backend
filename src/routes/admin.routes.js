import { Router } from "express";
import {
  getAllUsers,
  totalPostsCount,
} from "../controllers/adminController.js";
import { verifyToken } from "../middelwares/auth.middleware.js";
import verifyAdmin from "../middelwares/verifyAdmin.middleware.js";

const adminRouter = Router();

adminRouter.route("/allUsers").get(verifyToken, verifyAdmin, getAllUsers);
adminRouter
  .route("/totalPostCount")
  .get(verifyToken, verifyAdmin, totalPostsCount);

export default adminRouter;
