import { reportModel } from "../models/report.model.js";

const reportUser = async(req,res) =>{
    try {
        const {reportedBy,reportedUser,reason,description,reportType} = req?.body
        const newReport = await reportModel.create({
            reportedBy,
            reportedUser,
            reason,
            description,
            reportType
        })
        return res.status(200).json({newReport,message:'User reported successfully'})

    } catch (error) {
        console.log(error);
    }
}

const reportPost = async(req,res) =>{
    try {
        const {reportedBy,reportedPost,reason,description,reportType} = req?.body
        const newReport = await reportModel.create({
            reportedBy,
            reportedPost,
            reason,
            description,
            reportType
        })
        return res.status(200).json({newReport,message:'Post reported successfully'})

    } catch (error) {
        console.log(error);
    }
}

const getReportedUsers = async(req,res)=>{
   try {
    const reportedUsers =  await reportModel.find({reportType: 'User'})
    if(!reportedUsers || !reportedUsers.length > 0){
        return res.status(200).send({message:'No reported user found.'})
    }
    res.status(200).json({reportedUsers,message:'Reported users found'})
   } catch (error) {
    console.log(error);
   } 
}

const getReportedPosts = async(req,res)=>{
    try {
     const reportedPosts =  await reportModel.find({reportType: 'Post'})
     if(!reportedPosts || !reportedPosts.length > 0){
         return res.status(200).send({message:'No reported post found.'})
     }
     res.status(200).json({reportedPosts,message:'Reported posts found'})
    } catch (error) {
     console.log(error);
    } 
}

const getTotalReportsCount= async(req,res)=>{
    try {
        const reportedUsersCount =  await reportModel.countDocuments({reportType: 'User'})
        const reportedPostsCount =  await reportModel.countDocuments({reportType: 'Post'})
        if(reportedUsersCount === 0 && reportedPostsCount === 0){
            return res.status(200).send({message:'No reported count found.'})
        }
        res.status(200).json({reportedUsersCount,reportedPostsCount,message:'Reported count found'})
       } catch (error) {
        console.log(error);
       } 
}


export {reportUser,reportPost,getReportedUsers,getReportedPosts,getTotalReportsCount}