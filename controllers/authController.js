const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const verifyCaptcha = require("../utils/verifycaptcha");
const { sendEmail } = require("../utils/sendEmail");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register new user
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ message: req.t("errors.allFieldsRequired") });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: req.t("errors.userExists") });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "user",
      verificationToken,
      isVerified: false,
    });

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    await sendEmail(
      user.email,
      req.t("emails.verifySubject"),
      `<p>${req.t("emails.verifyGreeting", { name: user.firstName })}</p>
       <p>${req.t("emails.verifyInstruction")}</p>
       <a href="${verificationUrl}">${verificationUrl}</a>
       <p>${req.t("emails.ignoreIfNotYou")}</p>`
    );

    res.status(201).json({
      user: {
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user.id),
      message: req.t("success.register"),
    });
  } catch (err) {
    console.error("Register error:", err);
    res
      .status(500)
      .json({ message: req.t("errors.serverError", { error: err.message }) });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    user.lastLogin = new Date();
    await user.save();

    res.json({
      user: {
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        mfaEnabled: user.mfaEnabled,
        lastLogin: user.lastLogin,
      },
      token: generateToken(user.id),
      message: req.t("success.login"),
    });
  } else {
    res.status(400).json({ message: req.t("errors.invalidCredentials") });
  }
};

// Logout user
const logoutUser = (req, res) => {
  res.json({ message: req.t("success.logout") });
};

// Get current user profile
// Get current user profile
const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    user: {
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      mfaEnabled: user.mfaEnabled,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
};


// Refresh token
const refreshToken = (req, res) => {
  const userId = req.user.id;
  const token = generateToken(userId);
  res.json({ token });
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: req.t("errors.userNotFound") });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail(
      user.email,
      req.t("emails.resetSubject"),
      `<p>${req.t("emails.resetInstruction")}</p>
       <p><a href="${resetUrl}">${req.t("emails.clickHere")}</a></p>
       <p>${req.t("emails.resetExpiry")}</p>`
    );

    res.status(200).json({ message: req.t("success.resetEmailSent") });
  } catch (err) {
    res
      .status(500)
      .json({ message: req.t("errors.serverError", { error: err.message }) });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: req.t("errors.invalidOrExpiredToken") });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: req.t("success.passwordReset") });
  } catch (err) {
    res
      .status(400)
      .json({ message: req.t("errors.serverError", { error: err.message }) });
  }
};
const speakeasy = require("speakeasy");

// Generate MFA secret and backup codes
const generateMFASecret = (req, res) => {
  const secret = speakeasy.generateSecret({
    name: `YourApp (${req.user.email})`,
  });
  const backupCodes = Array.from({ length: 5 }, () =>
    crypto.randomBytes(4).toString("hex")
  );

  res.json({
    secret: secret.base32,
    qrCodeUrl: secret.otpauth_url,
    backupCodes,
  });
};

// Verify MFA token
const verifyMFAToken = (req, res) => {
  const { token } = req.body;
  const user = req.user;

  const isValid = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: "base32",
    token,
  });

  res.json({ success: isValid });
};

// Save MFA setup
const saveMFASetup = async (req, res) => {
  const { secret, backupCodes } = req.body;

  await User.findByIdAndUpdate(req.user.id, {
    mfaEnabled: true,
    mfaSecret: secret,
    mfaBackupCodes: backupCodes,
  });

  res.json({ success: true });
};
const verifyEmail = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({ message: req.t("errors.invalidToken") });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.json({ message: req.t("success.emailVerified") });
};

module.exports = {
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
  verifyEmail,
};
