import mongoose from "mongoose";
import validator from "email-validator";
import bcrypt from "bcrypt";

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      return validator.validate(this.email);
    },
  },

  password: {
    type: String,
    required: true,
    minLength: 6,
  },

  confirmPassword: {
    type: String,
    required: true,
    minLength: 6,
    validate: function () {
      return this.password === this.confirmPassword;
    },
  },

  LikedMovies: Array,
  WatchList: Array,

  isVerified: {
    type: Boolean,
    default: false,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", function () {
  this.confirmPassword = undefined;
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt();
  let hashPass = await bcrypt.hash(this.password, salt);
  this.password = hashPass;
});

const User = mongoose.model("User", UserSchema);

export default User;
