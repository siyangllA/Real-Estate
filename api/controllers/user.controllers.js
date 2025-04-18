import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {errorHandler} from "../utils/error.js"; 


export const test = (req, res) => {
    res.json({
      message: "API route is working!",
    });
  };
  

  export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" }); 
    }

    return res.status(200).json(updatedUser); 

  } catch (err) {
    return res.status(500).json({ message: err.message }); 
  }
};
