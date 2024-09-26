const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
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
  // Trying to find the user by email
  return this.findOne({ email }) // this – the User model
    .select("+password")
    .then((user) => {
      // User not found - rejecting the promise
      if (!user) {
        console.log("User not found");
        throw new Error("Incorrect email or password");
      }

      // Found - comparing hashes
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          console.log("Invalid password");
          throw new Error("Incorrect email or password");
        }

        // Password matches
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
