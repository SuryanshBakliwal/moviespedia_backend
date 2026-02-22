
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../Models/user.js";
import Token from "../Models/token.js";
import { sendMail } from "../utils/nodemailer.js";

const jwt_key = process.env.JWTTOKEN;

// --------------------- Check if user exists ---------------------
export const isUserExist = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    return res.status(200).json({ message: user ? "Email exists" : "Email does not exist", flag: !!user });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", flag: false });
  }
};

// --------------------- Get User Creds---------------------
export const getUserCreds = async (req, res) => {
  try {
    // userId comes from authMiddleware (decoded JWT)

    const userEmail = req.user.email;

    const user = await User.findOne({ email: userEmail })
    console.log(user);


    if (!user) {
      return res.status(404).json({
        message: "User not found",
        flag: false
      });
    }

    return res.status(200).json({
      message: "User found",
      flag: true,
      data: {
        email: user.email,
        username: user.username,
        name: user.name
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      flag: false
    });
  }
};


// --------------------- Create User ---------------------
export const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists." });

    user = await User.create({ name, email, password, confirmPassword });

    const token = await Token.create({ userId: user._id, token: crypto.randomBytes(32).toString("hex") });

    const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`;
    // await sendMail(user.email, "To Verify Your Account", `<p>Hello ${user.name}, <a href="${url}">click here</a> to verify your email.</p>`);
    await sendMail(
      user.email,
      "To Verify Your Account",
      `<p>Hello ${user.name},</p>
   <p>Please <a href="${url}">verify your email</a> to activate your account.</p>`
    );

    return res.status(200).json({ message: "Verification email sent. Please check your inbox." });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------- Login User ---------------------
export const loginUser = async (req, res) => {

  try {
    const { email, password } = req.body;
    console.log("hekooooooo", email, password);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    if (!user.isVerified) return res.status(403).json({ message: "Please verify your email first", isVerified: false });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("hekooooooo", isMatch);

    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const authToken = jwt.sign(
      { email: user.email },
      jwt_key,
      { expiresIn: "30m" }
    );
    console.log(authToken, user.email);

    // res.cookie("token", authToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //   maxAge: 30 * 60 * 1000
    // });
    res.cookie("token", authToken, {
      httpOnly: true,
      secure: false,   // 🔥 MUST be false
      sameSite: "lax", // 🔥 REQUIRED
      path: "/"
    });
    console.log(req.cookies)
    return res.status(200).json({ message: "Login successful", isVerified: true });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------- logout ---------------------
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

// --------------------- Verify Email ---------------------
export const verifyEmail = async (req, res) => {
  try {
    const { id, token } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(400).json({ message: "Invalid link" });

    const verifyToken = await Token.findOne({ userId: id, token });
    if (!verifyToken) return res.status(400).json({ message: "Invalid or expired link" });

    user.isVerified = true;
    await user.save();
    await verifyToken.deleteOne();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------- Resend Verification ---------------------
export const VerifyEmailLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User doesn't exist" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    const token = await Token.create({ userId: user._id, token: crypto.randomBytes(32).toString("hex") });
    const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`;
    await sendMail(user.email, "Account Verification", `<p>Hello ${user.name}, <a href="${url}">click here</a> to verify your email.</p>`);

    return res.status(200).json({ message: "Verification email sent again" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------- Forgot Password ---------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const url = `${process.env.BASE_URL}user/${user._id}/resetpassword`;
    await sendMail(user.email, "Reset Password", `<p>Hello ${user.name}, <a href="${url}">click here</a> to reset your password.</p>`);

    return res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------- Reset Password ---------------------
export const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body.credentials;
    const { id } = req.params;
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

    const user = await User.findById(id);
    if (!user) return res.status(400).json({ message: "Invalid link" });

    user.password = password;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
