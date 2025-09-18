const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
  generateMFASecret,
  verifyMFAToken,
  saveMFASetup,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/password/forgot", forgotPassword);
router.post("/password/reset/:token", resetPassword);
router.post("/refresh", refreshToken);

// Protected routes
router.get("/profile", protect, getMe);
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getMe);

// MFA routes (protected)
router.post("/mfa/generate", protect, generateMFASecret);
router.post("/mfa/verify", protect, verifyMFAToken);
router.put("/mfa/setup", protect, saveMFASetup);

module.exports = router;
