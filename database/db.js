import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_USERPASSWORD}@cluster0.6tpxfre.mongodb.net/`;
// const URL = process.env.DATABASE_URL;

const Connection = async () => {
  try {
    await mongoose.connect(URL);
    console.log("DB connected");
  } catch (error) {
    console.log("Getting error :", error);
  }
};

export default Connection;
