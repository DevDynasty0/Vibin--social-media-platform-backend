import { Router } from "express";
import { getSetting, updateSetting } from "../controllers/setting.controller.js";

const settingRouter = Router();

settingRouter.route("/update/:userEmail").patch(updateSetting);
settingRouter.route("/getSetting/:userEmail").get(getSetting);
// settingRouter.route("/deleteSetting/:id").delete(deleteSetting);
export default settingRouter; 

