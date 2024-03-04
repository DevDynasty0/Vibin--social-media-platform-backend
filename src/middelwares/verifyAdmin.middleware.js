import { User } from "../models/user.model.js";

const verifyAdmin = async (req, res, next) => {
  try {
    const findUser = await User.findOne({ _id: req.body.id });
    if (!findUser?.isAdmin) {
      return res.status(403).send({
        message: "Forbidden access",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

export default verifyAdmin;
