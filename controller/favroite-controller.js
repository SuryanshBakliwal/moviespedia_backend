import User from "../Models/user.js";

export const addFavroites = async (req, res) => {
  try {
    const email = req.body.email;
    const movie = req.body.movie;
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log("user not found");
      return res.json({ message: "User Not Found" });
    }
    const { LikedMovies } = user;

    const alreadyExists = LikedMovies.some((obj) => obj.id === movie.id);

    if (!alreadyExists) {
      await User.findByIdAndUpdate(
        user._id,
        {
          LikedMovies: [...user.LikedMovies, movie],
        },
        { new: true }
      );
      return res.json({ message: "Successfully Added" });
    } else {
      // const newArr = LikedMovies.filter((obj) => obj.id !== movie.id);
      await User.findByIdAndUpdate(
        user._id,
        { $pull: { LikedMovies: { id: movie.id } } },
        { new: true }
      );
      return res.json({ message: "Successfully deleted" });
    }
  } catch (error) {
    res.json({ message: error });
  }
};

export const getFavoriteMovies = async (req, res) => {
  try {
    let email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({ message: "user not found", movies: [] });
    }
    return res.json({ message: "success", movies: user.LikedMovies });
  } catch (error) {
    return res.json({ message: error });
  }
};

export const addWatchList = async (req, res) => {
  try {
    const { email, movie } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.json({ message: "user not found" });
    }
    let { WatchList } = user;
    let isExist = WatchList.some((obj) => obj.id === movie.id);
    if (!isExist) {
      await User.findByIdAndUpdate(
        user._id,
        {
          WatchList: [...user.WatchList, movie],
        },
        { new: true }
      );
      return res.json({ message: "Successfully Added" });
    } else {
      await User.findByIdAndUpdate(
        user._id,
        { $pull: { WatchList: { id: movie.id } } },
        { new: true }
      );
      return res.json({ message: "Successfully deleted" });
    }
  } catch (error) {
    return res.json({ message: error });
  }
};

export const getWatchList = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({ message: "user not found", movies: [] });
    }
    return res.json({ message: "success", movies: user.WatchList });
  } catch (error) {
    return res.json({ message: error });
  }
};
