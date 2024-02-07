import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    dob:{
      type:Date,
      trim: true,
    },
    university:{
      type: String,
      trim: true,
    },
    address:{
      type: String,
      trim: true,
    },
    extraEmail:{
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    religion:{
      type: String,
    },
    avatar: {
      type: String, //cloudinary url
      // required: true,
      default:
        "https://res.cloudinary.com/dsfyrjd8b/image/upload/v1707303580/by2cegfudppucnxbwvun.png",
    },
    coverImage: {
      type: String, //cloudinary
    },
    bio: {
      type: String, //cloudinary
    },
    likeHistory: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    gender: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    address: {
      type: String,
    },
    contactNumber: {
      type: Number,
    },
    religion: {
      type: String,
    },
    commentHistory: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      // username: this.username,
      // fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
