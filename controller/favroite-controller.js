import User from "../Models/user.js";


// ================= FAVORITES =================
export const addFavroites = async (req, res) => {
  try {

    const email = req.user.email;      // <-- from JWT
    const movie = req.body.movie;
    console.log(email, movie);
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log("user not found");
      return res.status(404).json({ message: "User Not Found" });
    }
    console.log(user);

    const { LikedMovies } = user;
    console.log("liked-------------------------", LikedMovies);

    const alreadyExists = LikedMovies.some((obj) => obj.id === movie.id);

    console.log("liked-------------------------", alreadyExists);
    if (!alreadyExists) {
      console.log("helooooooooo");

      const res = await User.findByIdAndUpdate(
        user._id,
        { $push: { LikedMovies: movie } },
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
    const email = req.user.email;    // <-- from JWT
    console.log("hello from getfav", email);

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "User not found", movies: [] });

    return res.json({ message: "Success", movies: user.LikedMovies });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= WATCHLIST =================
export const addWatchList = async (req, res) => {
  try {
    const email = req.user.email;    // <-- from JWT
    const movie = req.body.movie;
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
    const email = req.user.email;    // <-- from JWT

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "User not found", movies: [] });

    return res.json({ message: "Success", movies: user.WatchList });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
