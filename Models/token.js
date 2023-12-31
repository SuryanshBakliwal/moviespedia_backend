import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tokenSchema = mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    index: { expires: 10 }, // 1-hour
  },
});

const Token = mongoose.model("token", tokenSchema);

export default Token;
