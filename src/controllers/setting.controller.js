import { Setting } from "../models/setting.model.js";

// const updateSetting = async (req, res) => {
//   try {
//     const data = req.body;
//     const findUserSetting = await Setting.findOne(
//       {
//         "user._id": req.params.userId,
//       },
//     );
//     if(findUserSetting){
//         const updateUserSetting = await Setting.updateOne(
//             {
//               "user._id": req.params.userId,
//             },
//             {
//               $set: {
//                 ...data,
//               },
//             }

//           );
//           return res.status(200).send(updateUserSetting);
//     } else{
//         const result = await Setting.create(data)
//         return res.status(201).send(result);
//     }
   
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send(error);
//   }
// };
const updateSetting = async (req, res) => {
    try {
      const data = req.body;
      const findUserSetting = await Setting.findOne({ userEmail: req.params.userEmail });
      console.log("Hunululu",findUserSetting);
      if (findUserSetting) {
        const updateUserSetting = await Setting.findOneAndUpdate(
          { userEmail: req.params.userEmail },
          { $set: { ...data } },
          { new: true }
        );
  
        return res.status(200).send({ message: "Setting updated successfully", data: updateUserSetting });
      } else {
        const newSetting = await Setting.create(data);
        return res.status(201).send({ message: "New setting created", data: newSetting });
      }
  
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
  };
  

const getSetting = async(req, res) => {
    try {    
        const userSettingRes = await Setting.findOne({userEmail: req.params.userEmail});
        console.log(userSettingRes, "ajfafokja;f");
        return res.status(200).send(userSettingRes); 
    } catch (error) {
        return res.status(500).send(error);
    }
}

// const deleteSetting = async(req, res) => {
//     try {
//         const deletes = await Setting.deleteMany({_id : req.params.id});
//         const sayed = await Setting.find();
//         console.log(sayed);
//         return res.status(200).send(deletes);
//     } catch (error) {
//         return res.status(500).send(error)
//     }
// }

export { updateSetting, getSetting };
