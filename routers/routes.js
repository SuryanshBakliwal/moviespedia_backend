import express from "express";
import { body } from "express-validator";

import {
  VerifyEmailLogin,
  createUser,
  forgotPassword,
  isUserExist,
  loginUser,
  resetPassword,
  verifyEmail,
} from "../controller/user-controller.js";

import {
  addFavroites,
  addWatchList,
  getFavoriteMovies,
  getWatchList,
} from "../controller/favroite-controller.js";

const route = express.Router();

route.post(
  "/createuser",
  [
    body("email", "Enter Correct Email").isEmail(),
    body("password", "password must have more than 6 characters").isLength({
      min: 6,
    }),
  ],
  createUser
);

route
  .route("/loginuser")
  .post(
    [
      body("email", "Incorrect Email").isEmail(),
      body("password", "Enter correct Password").isLength({ min: 8 }),
    ],
    loginUser
  );

route.route("/:id/verify/:token").post(verifyEmail);
route.route("/addfavroites").post(addFavroites);
route.route("/isexist").post(isUserExist);
route.route("/forverify").post(VerifyEmailLogin);
route.route("/getfavorites").post(getFavoriteMovies);
route.route("/addwatchlist").post(addWatchList);
route.route("/getwatchlist").post(getWatchList);
route.route("/forgotpassword").post(forgotPassword);
route.route("/:id/resetpassword").post(resetPassword);

export default route;
