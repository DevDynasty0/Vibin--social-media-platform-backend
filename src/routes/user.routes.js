import { Router } from "express";
import {
  logOutUser,
  loginUser,
  refreshAccessToken,
  registerUser,
  getCurrentUser,
  getSuggestedUsers,
  followUser,
  getFollowings,
  getFollowers,
} from "../controllers/user.controller.js";
import { upload } from "../middelwares/multer.middleware.js";
import { verifyToken } from "../middelwares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyToken, logOutUser);
router.route("/current-user").get(verifyToken, getCurrentUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/suggested-users").get(verifyToken, getSuggestedUsers);
router.route("/follow-user").post(verifyToken, followUser);
router.route("/get-following-users").get(verifyToken, getFollowings);
router.route("/get-followers").get(verifyToken, getFollowers);

export default router;
