import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Please enter a valid email address" });
    }

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      profilePic,
    });
    return res.status(StatusCodes.CREATED).json({
      msg: "User registered successfully",
      user,
    });
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Please enter a valid email address" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    res.status(StatusCodes.OK).json({
      msg: "Login successful",
      user,
    });
  } catch (error) {
    console.log("Error in login controller: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Token not found" });
    }
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.log("Error in logout controller: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};
