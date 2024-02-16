import { Router } from "express";
import { getAllUsers, getSuspendedUsers, suspendUser, totalPostsCount } from "../controllers/adminController.js";
// import { verifyToken } from "../middelwares/auth.middleware.js";
// import verifyAdmin from "../middelwares/verifyAdmin.middleware.js";

const adminRouter = Router();

// please use verifyToken, verifyAdmin,
adminRouter.route("/allUsers").get( getAllUsers );
adminRouter.route("/totalPostCount").get( totalPostsCount );
adminRouter.route("/suspendUser").post(suspendUser);
adminRouter.route("/getSuspendUsers").get(getSuspendedUsers);

export default adminRouter;

