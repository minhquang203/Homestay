const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, unique: true },
    tripList: { type: Array, default: [] },
    wishList: { type: Array, default: [] },
    propertyList: { type: Array, default: [] },
    reservationList: { type: Array, default: [] },
    address: { type: String }, 
    phone: { type: String },   
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
