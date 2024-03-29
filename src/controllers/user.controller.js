import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

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

const logOutUser = asyncHandler(async (req, res) => {
  const findUser = User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
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

const getCurrentUser = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  getCurrentUser,
};
