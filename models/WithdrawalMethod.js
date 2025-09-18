const mongoose = require("mongoose");

const withdrawalMethodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    methodName: {
      type: String,
      required: true,
    },
    accountDetails: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WithdrawalMethod", withdrawalMethodSchema);
