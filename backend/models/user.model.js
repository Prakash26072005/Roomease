import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  otp: { type: String },
  otpExpiry: { type: Date },
});

export default mongoose.model("User", userSchema);