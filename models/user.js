const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  console.log("here are your email and password", email, password);
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        console.log("user not found");
        return Promise.reject(new Error("Incorrect email or password"));
      }
      console.log(user);
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          console.log("password doesnt match");
          return Promise.reject(new Error("Incorrect email or password"));
        }
        return user;
      });
    });
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
