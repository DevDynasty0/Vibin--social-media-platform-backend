import mongoose, { Schema } from 'mongoose' ;

const reportSchema = new Schema({
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportedUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reportedPost:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    reason:{
        type: String,
        enum:['Spam','Harassment','Inappropriate content','Violence','Others'],
        required: true
    },
    description:{
        type: String
    },
    status:{
        type: String,
        enum:['Pending','Reviewed','Resolved'],
        required: true,
        default: 'Pending'
    },
    reportType:{
        type: String,
        enum:['User','Post'],
        required: true
    }
},{timestamps:true})

export const reportModel = mongoose.model("Report", reportSchema);