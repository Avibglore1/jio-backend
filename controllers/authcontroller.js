import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendRegisterMail, welcomeMail, sendForgotMail } from "../utilities/sendMail.js";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  console.log("Received signup request:", req.body); // ✅ Log request data

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    console.log("❌ Missing fields");
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    console.log("❌ User already exists");
    return res.status(200).json({ message: "User already exists, Redirecting to login", redirect: "/login"  });
  }

  console.log("✅ User does not exist. Proceeding with hashing...");
  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = String(Math.floor(100000 + Math.random() * 900000));

  const activationToken = jwt.sign(
    { email, username, password: hashedPassword, otp },
    process.env.Jwt_Sec,
    { expiresIn: "10m" }
  );

  console.log("✅ Hashed password created");
  

  try {
    await sendRegisterMail(email, "Jio Cinema", { username, otp });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send OTP email" });
  }

  res.status(200).json({ message: "OTP sent", activationToken });
};

export const verify = async (req, res) => {
  const { otp, activationToken } = req.body;

  if (!otp || !activationToken) {
    return res.status(400).json({ message: "OTP and activation token are required." });
  }

  let decodedData;
  try {
    // ✅ Decode the activation token first
    decodedData = jwt.verify(activationToken, process.env.Jwt_Sec);
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired activation token." });
  }

  // ✅ Extract data from the decoded token
  const { email, username, password, otp: storedOtp } = decodedData;

  // ✅ Check if the OTP matches
  if (storedOtp !== otp) {
    return res.status(400).json({ message: "Wrong OTP. Please try again." });
  }

  // ✅ Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already registered. Please log in." });
  }

  // ✅ Save the new user to the database
  await User.create({
    username,
    email,
    password, // Ensure password is hashed before storing
  });
  console.log('user registered succesfully');
  try {
    await welcomeMail(email, "Jio Cinema", { username });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send welcome email" });
  }
  res.json({ message: "User registered successfully!" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    console.log('email not found');
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch){
    console.log('password mismatch');
    return res.status(401).json({ message: "Invalid credentials" });
  } 

  const token = jwt.sign({ id: user._id }, process.env.Jwt_Sec, { expiresIn: "7d" });

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ 
    message: "Login successful",
    status: "success",
    user: user, 
    token });
};


export const logout = (req, res) => {
  res.cookie("authToken", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  req.session?.destroy?.(); // Destroy session if applicable

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  try {
    console.log('Started forgot password process');

    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: "No user with this email" });
    }

    // Generate a reset token
    const token = jwt.sign({ email }, process.env.Forgot_Secret, { expiresIn: "5m" });
    console.log('Token generated, preparing to send email');

    // Send reset email
    await sendForgotMail("Password Reset", { email, token });
    console.log('Email sent successfully');

    // Set token expiration time in user document
    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    res.json({ message: "Reset password link sent to your email" });

  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: "Something went wrong, please try again later" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body; // Get token and password from body

  if (!token || !password) {
    console.log('token and password required');
    return res.status(400).json({ message: "Token and password are required" });
  }

  try {
    const decodedData = jwt.verify(token, process.env.Forgot_Secret);

    const user = await User.findOne({ email: decodedData.email });

    if (!user) {
      return res.status(404).json({ message: "No user with this email" });
    }

    if (!user.resetPasswordExpire || user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ message: "Token Expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordExpire = null;

    await user.save();

    res.json({ message: "Password Reset Successfully!" });
  } catch (error) {
    console.error("Token Verification Error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};