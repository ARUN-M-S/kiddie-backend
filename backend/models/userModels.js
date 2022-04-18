const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // for password reset

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your Name"],
    maxLength: [13, "Name cannot be Exceed 13 characters"],
    minLengtgh: [4, "Name should b e atleast 4 character required "],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLengtgh: [8, "Password should be atleast 8  character required "],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
// Compare Password

userSchema.methods.comparePassword = async function (enterdPassword) {
  return await bcrypt.compare(enterdPassword, this.password);
};

// Generating Password Token

userSchema.methods.getResetPasswordToken = function () {
  //generating tokens

  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding to user scheme 2:54

  this.resetPasswordToken = crypto
    .createHash("SHA256")
    .update(resetToken)
    .digest("hex");
    this.resetPasswordExpire =Date.now() + 15 * 60 *1000;
     return resetToken;
};

module.exports = mongoose.model("User", userSchema);
