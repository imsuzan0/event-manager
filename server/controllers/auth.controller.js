import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model.js";
import { tokenToResponse } from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Please fill in all the required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(StatusCodes.BAD_REQUEST).json({ msg: "Email already exists" });
    }
    const profilePic = `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`;

    const user = await User.create({
      fullName,
      email,
      password,
      profilePic,
    });
    const tokenUser = { name: user.fullName, userId: user._id };
    tokenToResponse({ res, user: tokenUser, message:"User Registered Successfully" });
  } catch (error) {
    console.log("Error in register controller: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Please fill in all the required fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User not found" });
    }

    const isPasswordCorrect = user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid password" });
    }

    const tokenUser = { name: user.fullName, userId: user._id };
    tokenToResponse({ res, user: tokenUser, message:"User Logged in Successfully" });
  } catch (error) {
    console.log("Error in login controller: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      sameSite: "none",
      secure: "true",
    });
    res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};


export const getMe = async (req, res) => {
  try {
    // req.user should already be set by your authentication middleware
    const userId = req.user.userId;

    const user = await User.findById(userId).select("fullName email profilePic");

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
    }

    res.status(StatusCodes.OK).json({
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.log("Error in getMe controller: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};
