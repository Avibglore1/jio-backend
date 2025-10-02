import express from "express";

import { loginHandler, signupHandler, forgetPasswordHandler, resetPasswordHandler, logoutController }
 from "./../controllers/AuthController.js";

export const AuthRouter = express.Router();

AuthRouter.post("/login", loginHandler);
AuthRouter.post("/signup", signupHandler);
AuthRouter.patch("/forgetPassword", forgetPasswordHandler);
AuthRouter.patch("/resetPassword", resetPasswordHandler);
AuthRouter.get("/logout", logoutController);

