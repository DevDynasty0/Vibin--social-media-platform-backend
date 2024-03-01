import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    const token = req?.cookies?.accessToken;
    // const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized request.");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodeToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token.");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token.");
  }
});
