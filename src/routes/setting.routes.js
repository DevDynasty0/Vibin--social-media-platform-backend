import { Router } from "express";
import { blockUser, getBlockedUsers, getSetting, unFollowUser, updateSetting } from "../controllers/setting.controller.js";
// import { verifyToken } from "../middelwares/auth.middleware.js";

const settingRouter = Router();

settingRouter.route("/update/:userEmail").patch(updateSetting);
settingRouter.route("/getSetting/:userEmail").get(getSetting);
settingRouter.route("/deleteFollower").delete( unFollowUser);
settingRouter.route("/blockUser").post(blockUser);
settingRouter.route("/getblockUsers/:userId").get(getBlockedUsers)
export default settingRouter;

