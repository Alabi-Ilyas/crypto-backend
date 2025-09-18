const mongoose = require("mongoose");

const securityEventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    type: { type: String, required: true }, // e.g., "login", "failed-login", "password-change"
    ip: { type: String },
    userAgent: { type: String },
    description: { type: String }, // optional detailed message
  },
  { timestamps: true }
);

module.exports = mongoose.model("SecurityEvent", securityEventSchema);
