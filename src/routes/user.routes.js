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
  getUserProfile,
  googleLogin,
  changeAvatar,
  changeCoverImage,
  updateUserDetails,
  getUserRole,
} from "../controllers/user.controller.js";
import { upload } from "../middelwares/multer.middleware.js";
import { verifyToken } from "../middelwares/auth.middleware.js";
import { getSearchResult } from "../controllers/search.controller.js";
import { reportPost, reportUser } from "../controllers/report.controller.js";

const router = Router();

router.route("/search").get(getSearchResult);

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
router.route("/google-login").post(googleLogin);
router.route("/logout").post(verifyToken, logOutUser);

router.route("/current-user").get(verifyToken, getCurrentUser);

router.route("/refresh-token").post(refreshAccessToken);
router.route("/suggested-users").get(verifyToken, getSuggestedUsers);
router.route("/follow-user").post(verifyToken, followUser);
router.route("/get-following-users").get(verifyToken, getFollowings);
router.route("/get-followers").get(verifyToken, getFollowers);
router.route("/:_id").get(verifyToken, getUserProfile);
router.route("/update-user-details").patch(verifyToken, updateUserDetails);
router.route("/user/role").get(getUserRole);
router
  .route("/change-avatar")
  .patch(verifyToken, upload.single("avatar"), changeAvatar);
router
  .route("/change-cover-image")
  .patch(verifyToken, upload.single("coverImage"), changeCoverImage);

router.route('/report-user').post(reportUser)
router.route('/report-post').post(reportPost)

export default router;
