import mongoose from "mongoose";
import validator from "email-validator";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email) {
        return validator.validate(email);
      },
      message: "Invalid email format",
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  LikedMovies: {
    type: [Object],
    default: [],
  },

  WatchList: {
    type: [Object],
    default: [],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to hash password and remove confirmPassword
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model("User", UserSchema);
export default User;
