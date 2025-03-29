import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema({
  poster_path: { type: String, default: '' }, // Make poster_path optional with default empty string
  name: { type: String, required: true },
  id: { type: Number, required: true } // Change to Number to match TMDB ID
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordExpire: { type: Date },
  otp: { type: String },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: "user"
  },
  wishlist: [wishlistItemSchema]
});

export default mongoose.model("User", UserSchema);