import express from "express";
import  { register, verify,  login, logout, forgotPassword, resetPassword } from 
"./../controllers/authcontroller.js";


const router = express.Router();

router.post("/register", register);
router.post("/verify", verify);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);

export default router;
