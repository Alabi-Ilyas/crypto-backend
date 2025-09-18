const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ["user", "admin"], default: "user" },
  isVerified:{ type: Boolean, default: false },
  verificationToken: { type: String },
  lastLogin: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  mfaEnabled: { type: Boolean, default: false },
  mfaSecret: { type: String },
  mfaBackupCodes: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
