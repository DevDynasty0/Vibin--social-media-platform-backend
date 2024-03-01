import { PostModel } from "../models/post.model.js";
import { SuspendUser } from "../models/suspendUser.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.aggregate([
      {
        $lookup: {
          from: "suspendusers",
          localField: "_id",
          foreignField: "normalUser",
          as: "suspendedUsers",
        },
      },
      {
        $match: {
          suspendedUsers: { $eq: [] },
        },
      },
    ]);
    return res.status(200).json(new ApiResponse(200, allUsers, "all users"));
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const totalPostsCount = async (req, res) => {
  try {
    const totalPosts = await PostModel.countDocuments();
    return res
      .status(200)
      .json(new ApiResponse(200, totalPosts, "Total posts"));
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const suspendUser = async (req, res) => {
  try {
    const data = {
      normalUser: req.body.normalUser,
      admin: req.body.admin,
    };
    const result = await SuspendUser.create(data);

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Suspend successfully"));
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const getSuspendedUsers = async (req, res) => {
  try {
    const result = await SuspendUser.find().populate("normalUser");
    return res
      .status(200)
      .json(new ApiResponse(200, result, " get Suspend successfully"));
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const getUserGrowthChartData = async (req, res) => {
  try {
    const currentDate = new Date();

    const result = await User.aggregate([
      {
        $addFields: {
          weekAgo: {
            $dateDiff:
            {
              startDate: "$createdAt",
              endDate: currentDate,
              unit: "week"
            }
          }
        }
      },
      {
        $match: {
          weekAgo: {
            $lte: 6
          }
        }
      }
      ,
      {
        $group: {
          _id: "$weekAgo",
          userJoined: { $sum: 1 },

        }
      },
      { $sort: { _id: -1 } }

      // {
      //   // $project:
      //   // {
      //   //   weekAgo: 1
      //   //   // month: { $month: "$createdAt" },
      //   //   // day: { $dayOfMonth: "$createdAt" },
      //   //   // hour: { $hour: "$date" },
      //   //   // minutes: { $minute: "$date" },
      //   //   // seconds: { $second: "$date" },
      //   //   // milliseconds: { $millisecond: "$date" },
      //   //   // dayOfYear: { $dayOfYear: "$date" },
      //   //   // dayOfWeek: { $dayOfWeek: "$date" },
      //   //   // week: { $week: "$date" }
      //   // }
      // }


    ])

    return res.send(result)
  } catch (error) {
    console.log(error);
  }
};
const getPostRateChartData = async (req, res) => {
  try {
    const currentDate = new Date();

    const result = await PostModel.aggregate([
      {
        $addFields: {
          weekAgo: {
            $dateDiff:
            {
              startDate: "$createdAt",
              endDate: currentDate,
              unit: "week"
            }
          }
        }
      },
      {
        $match: {
          weekAgo: {
            $lte: 6
          }
        }
      }
      ,
      {
        $group: {
          _id: "$weekAgo",
          totalPosts: { $sum: 1 },

        }
      },
      { $sort: { _id: -1 } }


    ])

    return res.send(result)
  } catch (error) {
    console.log(error);
  }
};

const getPostTypeChartData = async (req, res) => {
  try {

    const result = await PostModel.aggregate([
      {
        $match: {
          contentType: {
            "$ne": null
          }
        }
      },
      {
        $group: {
          _id: "$contentType",
          total: { $sum: 1 },

        }
      },
      { $sort: { _id: -1 } }



    ])

    return res.send(result)
  } catch (error) {
    console.log(error);
  }
};


export { getAllUsers, totalPostsCount, suspendUser, getSuspendedUsers, getUserGrowthChartData, getPostRateChartData, getPostTypeChartData };