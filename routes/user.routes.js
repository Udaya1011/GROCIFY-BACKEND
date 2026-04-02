import express from "express";
import {
  checkAuth,
  forgotPasswordOTP,
  googleLogin,
  loginUser,
  logout,
  otpLogin,
  registerUser,
  resetPassword,
  resetPasswordOTP,
} from "../controller/user.controller.js";
import authUser from "../middlewares/authUser.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password-otp", forgotPasswordOTP);
router.post("/reset-password-otp", resetPasswordOTP);
router.post("/google-login", googleLogin);
router.post("/otp-login", otpLogin);
router.get("/is-auth", authUser, checkAuth);
router.get("/logout", authUser, logout);

export default router;
