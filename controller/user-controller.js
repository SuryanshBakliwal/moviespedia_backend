import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import JWT from "jsonwebtoken";
import User from "../Models/user.js";
import nodemailer from "nodemailer";
import Token from "../Models/token.js";
import crypto from "crypto";

dotenv.config();
const jwt_key = process.env.JWTTOKEN;

export const createUser = async (req, res) => {
  // console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return res.status(400).json({
      error: errors.array(),
    });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.json({ message: "email already exists" });
    }
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });
    user = await user.save();
    const token = await Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`;
    await sendMailToVerify(
      user.email,
      user.name,
      url,
      "For Acount Verification"
    );
    res
      .status(200)
      .send({ message: "An Email sent to your account, Please Verify" });
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return res.status(400).json({
      error: errors.array(),
    });
  }
  try {
    const password = req.body.password;
    const email = req.body.email;
    await User.findOne({ email })
      .then(async (user) => {
        if (!user.isVerified) {
          return res.json({
            message: "First verfiy your email Id",
            isVerified: false,
          });
        } else {
          let comparePassword = await bcrypt.compare(password, user.password);
          let uid = user._id;
          let authToken = await JWT.sign({ payload: uid }, jwt_key);
          if (comparePassword) {
            return res.json({
              message: "successfully Login",
              userId: uid,
              isVerified: true,
              authToken: authToken,
            });
          }
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};

export const VerifyEmailLogin = async (req, res) => {
  try {
    const email = req.body.email;
    let user = await User.findOne({ email: email });
    if (!user.isVerified) {
      const token = await Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`;
      await sendMailToVerify(
        user.email,
        user.name,
        url,
        "For Acount Verification"
      );
      res
        .status(200)
        .send({ message: "An Email sent to your account, Please Verify" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log();
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.json({ message: "User Not Found" });
    }
    const url = `${process.env.BASE_URL}user/${user._id}/resetpassword`;
    await sendMailToResetPassword(
      user.email,
      user.name,
      url,
      "For Reset Password"
    );
    res
      .status(200)
      .send({ message: "An Email sent to your account, Please Check..." });
  } catch (error) {}
};

const sendMailToVerify = async (email, name, url, subject) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: Number(process.env.PORT),

    secure: Boolean(process.nextTick.SECURE),
    auth: {
      user: process.env.DB_AUTH_MAIL,
      pass: process.env.DB_AUTH_MAIL_PASSWORD,
    },
  });

  transporter.sendMail({
    from: process.env.DB_AUTH_MAIL,
    to: email,
    subject: subject,
    html:
      "<p>Hello " +
      name +
      ` please <a href="${url}">click here</a>
      to verify your email`,
  });
};

const sendMailToResetPassword = async (email, name, url, subject) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: Number(process.env.PORT),
    secure: Boolean(process.nextTick.SECURE),

    auth: {
      user: process.env.DB_AUTH_MAIL,
      pass: process.env.DB_AUTH_MAIL_PASSWORD,
    },
  });

  transporter.sendMail({
    from: process.env.DB_AUTH_MAIL,
    to: email,
    subject: subject,
    html:
      "<p>Hello " +
      name +
      ` We're sending this email because you're requested password reset. <a href="${url}">click here</a>
      to create a new password` +
      "</p>",
  });
};

export const verifyEmail = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid Link" });
    let token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).send({ message: "Invalid Link" });
    }

    await User.updateOne({
      _id: user._id,
      isVerified: true,
    });
    await token.remove();
    return res.status(200).send({ message: "email verified successfully" });
  } catch (err) {
    console.log(err);
    res.status(200).send({ message: err });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { credentials } = req.body;
    let { password, confirmPassword } = credentials;
    console.log(credentials);
    const { id } = req.params;
    console.log(id);

    let user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(400).send({ message: "Invalid Link" });
    }
    if (password === confirmPassword) {
      const salt = await bcrypt.genSalt();
      let hashPass = await bcrypt.hash(password, salt);
      password = hashPass;
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            password: password,
          },
        },
        { new: true }
      );
    } else {
      return res.status(200).send({ message: "Please confirm your password" });
    }
    return res.status(200).send({ message: "Password Reset Successfully" });
  } catch (error) {
    console.log(error);
  }
};
