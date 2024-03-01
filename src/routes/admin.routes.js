import { Router } from "express";
import { getAllUsers, getPostRateChartData, getPostTypeChartData, getSuspendedUsers, getUserGrowthChartData, suspendUser, totalPostsCount } from "../controllers/adminController.js";
import { getReportedPosts, getReportedUsers, getTotalReportsCount } from "../controllers/report.controller.js";
// import { verifyToken } from "../middelwares/auth.middleware.js";
// import verifyAdmin from "../middelwares/verifyAdmin.middleware.js";

const adminRouter = Router();

// please use verifyToken, verifyAdmin,
adminRouter.route("/allUsers").get( getAllUsers );
adminRouter.route("/totalPostCount").get( totalPostsCount );
adminRouter.route("/suspendUser").post(suspendUser);
adminRouter.route("/getSuspendUsers").get(getSuspendedUsers);
adminRouter.route('/getReportedUsers').get(getReportedUsers);
adminRouter.route('/getReportedPosts').get(getReportedPosts);
adminRouter.route('/getTotalReportsCount').get(getTotalReportsCount);
adminRouter.route('/getUserGrowthChartData').get(getUserGrowthChartData);
adminRouter.route('/getPostRateChartData').get(getPostRateChartData);
adminRouter.route('/getPostTypeChartData').get(getPostTypeChartData);
export default adminRouter;

