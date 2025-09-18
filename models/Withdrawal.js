const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // For generating unique IDs

const withdrawalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    method: { type: String }, // optional: bank, crypto, etc.
    transactionId: { type: String, unique: true, default: () => uuidv4() }, // auto-generate unique ID
  },
  { timestamps: true }
);

module.exports = mongoose.model("Withdrawal", withdrawalSchema);
