import express from "express";
import { body } from "express-validator";


import {
  VerifyEmailLogin,
  createUser,
  forgotPassword,
  getUserCreds,
  isUserExist,
  loginUser,
  logoutUser,
  resetPassword,
  verifyEmail,
} from "../controller/user-controller.js";

import {
  addFavroites,
  addWatchList,
  getFavoriteMovies,
  getWatchList,
} from "../controller/favroite-controller.js";
import { basedOnGenre, getMovieBackDrop, getMovieCredits, getMovieDetail, getMovieRecommendation, hollyBolly, monetization, moviesTypes, tredingMovies } from "../controller/movies-controller.js";
import { getEpisodeBackdrop, getEpisodeDetail, getSeasonDetail, getShowsByType, getTvCast, getTvShowBackdrops, getTvShowCredits, getTvShowDetail, getTvShowRecommendation } from "../controller/tvshows-controller.js";
import { getPeopleDetail, getPeopleImages, getPeopleMovieCredits, getPeopleTvCredits } from "../controller/people-controller.js";
import { searchMulti } from "../controller/search-controller.js";
import { authMiddleware } from "./middleware.js";

const router = express.Router();

router.post(
  "/createuser",
  [
    body("email", "Enter Correct Email").isEmail(),
    body("password", "password must have more than 6 characters").isLength({
      min: 6,
    }),
  ],
  createUser
);

router
  .route("/loginuser")
  .post(
    [
      body("email", "Incorrect Email").isEmail(),
      body("password", "Enter correct Password").isLength({ min: 8 }),
    ],
    loginUser
  );

router.route("/logout").post(logoutUser);

router.route("/getToken").get(authMiddleware, getUserCreds)
router.route("/:id/verify/:token").post(verifyEmail);
router.route("/isexist").post(isUserExist);
router.route("/forverify").post(VerifyEmailLogin);
router.route("/addfavroites").post(authMiddleware, addFavroites);
router.route("/getfavorites").get(authMiddleware, getFavoriteMovies);
router.route("/addwatchlist").post(authMiddleware, addWatchList);
router.route("/getwatchlist").get(authMiddleware, getWatchList);
router.route("/forgotpassword").post(forgotPassword);
router.route("/:id/resetpassword").post(resetPassword);



// routers for the movies
router.route("/trending").get(tredingMovies);
router.get("/genre", basedOnGenre);
router.get("/monetization", monetization);
router.get("/holly-bolly", hollyBolly);
router.get("/movies-types", moviesTypes);

router.get("/movie/:id", getMovieDetail);
router.get("/movie/:id/credits", getMovieCredits);
router.get("/movie/:id/images", getMovieBackDrop);
router.get("/movie/:id/recommendations", getMovieRecommendation);
router.get("/movies-types", moviesTypes);


router.get("/tv/:id", getTvShowDetail);
router.get("/tv/type/:type", getShowsByType);
router.get("/tv/:id/credits", getTvShowCredits);
router.get("/tv/:id/aggregate-credits", getTvCast);
router.get("/tv/:id/images", getTvShowBackdrops);
router.get("/tv/:id/recommendations", getTvShowRecommendation);
router.get("/tv/:id/season/:season", getSeasonDetail);
router.get("/tv/:id/season/:season/episode/:episode", getEpisodeDetail);
router.get("/tv/:id/season/:season/episode/:episode/images", getEpisodeBackdrop);


router.get("/people/:id", getPeopleDetail);
router.get("/people/:id/tv-credits", getPeopleTvCredits);
router.get("/people/:id/movie-credits", getPeopleMovieCredits);
router.get("/people/:id/images", getPeopleImages);

router.get("/search/", searchMulti);

export default router;
