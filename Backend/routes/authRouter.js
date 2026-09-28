// External Module
const express = require("express");
const authRouter = express.Router();

// Local Module
const authController = require("../controllers/authController");


authRouter.post("/login", authController.postLogin)
authRouter.post("/signup", authController.postSignUp);
authRouter.post("/auth/request-otp", authController.requestOtp);
authRouter.post("/auth/verify-otp", authController.verifyOtp);
authRouter.post("/auth/google", authController.googleAuth);

module.exports = authRouter;
