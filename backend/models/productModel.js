const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter the Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter the Description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter the rate of the Product"],
    maxLength: [6, "Cannot Exceed 6 characters"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please Enter The product Category"],
  },
  Stock: {
    type: Number,
    required: [true, "Please Enter the Product Category"],
    maxLength: [4, "Cannot Exceed 4 Characters"],
    default: 1,
  },
  numofReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true,

  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Product", productSchema);
