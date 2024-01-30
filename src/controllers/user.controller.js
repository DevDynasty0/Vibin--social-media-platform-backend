import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { Following } from "../models/follow.model.js";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    // the mistake was not writing accese token env in user model while
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something Went Wrong while generating tokens.");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation
  //check if already exist by: email, username
  //check for images/avatar
  //check multer did it correctly
  //upload them in cloudinary
  //create user object for create entry in db
  //remove password and refresh token from password
  //check for user creation
  //return res(response)

  const { fullName, email, password } = req.body;

  if ([fullName, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(
      400,
      "Fullname, password, email and username are required."
    );
  }

  const ifUserExist = await User.findOne({
    email,
    // $or: [{ email }, { username }],
  });

  if (ifUserExist) {
    throw new ApiError(409, "User with same email or username already exists");
  }
  console.log(req.files);
  // get the file paths or empty strings if no files are present [nullish coalescing operator (??)]
  const avatarLocalPath = req.files?.avatar?.[0]?.path || "";
  const coverLocalPath = req.files?.coverImage?.[0]?.path || "";
  console.log(avatarLocalPath, "local path");

  if (!avatarLocalPath) {
    // throw new ApiError(400, "Avatar local path is requred");
    console.log("No avatar file path available");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverLocalPath);

  if (!avatar) {
    // throw new ApiError(400, "Avatar file is requred");
    console.log("No avatar file was found");
  }

  const newUser = await User.create({
    fullName,
    avatar: avatar?.url || "",
    coverImage: coverImage?.url || "",
    email,
    password,
    // username: username?.toLowerCase() || "",
  });

  console.log(newUser);

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    newUser._id
  );

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something Went wrong while registering.");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { createdUser, accessToken, refreshToken },
        "User registered successfully"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  //get email, password from req.body
  //find user with email
  //check password
  //generate access and refresh token
  //send tokens to cookie

  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required!");
  }
  const user = await User.findOne({ email });
  // //#for findOne by username or email
  //await User.findOne({
  //   $or :[{email},{username}]
  // })

  if (!user) {
    throw new ApiError(404, "User doesn't exist!");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password Invalid");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully."
      )
    );
});

const googleLogin = asyncHandler(async (req, res) => {
  const decodedCredential = jwt.decode(req.body.credential);
  const ifUserExist = await User.findOne({
    email: decodedCredential?.email,
  });

  let newUser = null;

  if (!ifUserExist) {
    newUser = await User.create({
      fullName: decodedCredential?.name,
      avatar: decodedCredential?.picture || "",
      email: decodedCredential?.email,
      password: "googleUserPassword",
      // username: username?.toLowerCase() || "",
    });
  } else {
    newUser = ifUserExist;
  }

  console.log(newUser, "user from google login");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    newUser._id
  );

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something Went wrong while signing in with google."
    );
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { createdUser, accessToken, refreshToken },
        "User registered successfully unsing google."
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  const findUser = User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out."));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access.");
  }
  try {
    const decodeToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodeToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token invalid.");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refresh succesfull."
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .send(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const getSuggestedUsers = asyncHandler(async (req, res) => {
  const suggestedUsers = await User.aggregate([
    { $match: { _id: { $ne: req.user._id } } },
    { $sample: { size: 4 } },

    {
      $project: {
        fullName: 1,
        email: 1,
        avatar: 1,
      },
    },
  ]).exec();

  if (!suggestedUsers || suggestedUsers.length === 0) {
    throw new ApiError(501, "Suggested users not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        suggestedUsers,
        "Fetched suggested users succefully."
      )
    );
});

const followUser = asyncHandler(async (req, res) => {
  const { profile, follower } = req.body;

  if (!(follower || profile)) {
    throw new ApiError(401, "Both follower and profile id requird.");
  }
  const isFollowExist = await Following.findOne({
    $and: [{ profile }, { follower }],
  });

  if (isFollowExist) {
    throw new ApiError(401, "Already following this profile.");
  }

  const newFollow = await Following.create({
    profile,
    follower,
  });

  const createdFollow = await Following.findById(newFollow._id);

  if (!createdFollow) {
    throw new ApiError(500, "Something Went wrong while following.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdFollow, "Followed successfully"));
});

const getFollowings = asyncHandler(async (req, res) => {
  console.log(req.user?._id);
  const followings = await Following.find({ follower: req.user?._id })
    .populate("profile")
    .exec();
  console.log(followings);

  return res
    .status(200)
    .json(new ApiResponse(200, followings, "Fetched users you're following."));
});
const getFollowers = asyncHandler(async (req, res) => {
  console.log(req.user?._id);
  const followers = await Following.find({ profile: req.user?._id })
    .populate("follower")
    .exec();
  console.log(followers);

  return res
    .status(200)
    .json(new ApiResponse(200, followers, "Fetched users you're following."));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  console.log(_id);
  if (!_id) {
    throw new ApiError(400, "User id is missing");
  }

  const profile = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(_id),
      },
    },
    {
      $lookup: {
        from: "followings",
        localField: "_id",
        foreignField: "profile",
        as: "followers",
      },
    },
    {
      $lookup: {
        from: "followings",
        localField: "_id",
        foreignField: "follower",
        as: "followingTo",
      },
    },
    {
      $addFields: {
        followersCount: {
          $size: "$followers",
        },
        followingCount: {
          $size: "$followingTo",
        },
        isFollowing: {
          $cond: {
            if: { $in: [req.user?._id, "$followers.follower"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        email: 1,
        followingCount: 1,
        followersCount: 1,
        isFollowing: 1,
        avatar: 1,
        coverImage: 1,
      },
    },
  ]);

  console.log(profile);

  if (!profile.length) {
    throw new ApiError(404, "Channel doesn't exist.");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, profile[0], "User profiles fetched successfully.")
    );
});

export {
  registerUser,
  loginUser,
  googleLogin,
  logOutUser,
  refreshAccessToken,
  getCurrentUser,
  getSuggestedUsers,
  followUser,
  getFollowings,
  getFollowers,
  getUserProfile,
};
