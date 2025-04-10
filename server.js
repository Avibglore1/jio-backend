import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; 
import authRouter from "./routes/authRoutes.js";
import PaymentRouter from "./routes/paymentRoutes.js";
import wishlistRouter from "./routes/wishlistRoutes.js"
import VideoRouter from "./routes/videoRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://jio-frontend-rney-biate7xn1.vercel.app/", // Frontend URL
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Allow cookies, authorization headers, etc.
  })
);
app.use(express.json());


// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", wishlistRouter);
app.use("/api/video", VideoRouter);
app.use("/api/payment", PaymentRouter);
app.use("/",function(req,res){
  res.status(200).send("Hello from server");
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
