const Withdrawal = require("../models/Withdrawal");
const Transaction = require("../models/Transaction");
const WithdrawalMethod = require("../models/WithdrawalMethod");

// Request withdrawal (user)
const requestWithdrawal = async (req, res) => {
  try {
    const { amount, method } = req.body;

    // ✅ Validate method exists for this user
    const methodExists = await WithdrawalMethod.findOne({
      user: req.user._id,
      methodName: method,
    });

    if (!methodExists) {
      return res.status(400).json({ message: req.t("errors.methodNotFound") });
    }

    // Create withdrawal
    const withdrawal = await Withdrawal.create({
      user: req.user._id,
      amount,
      method,
    });

    // ✅ Log transaction
    await Transaction.create({
      user: req.user._id,
      type: "withdrawal",
      amount,
      method,
      reference: withdrawal.transactionId,
      status: withdrawal.status || "pending",
    });

    // Return a cleaner response
    res.status(201).json({
      id: withdrawal._id,
      transactionId: withdrawal.transactionId,
      user: withdrawal.user,
      amount: withdrawal.amount,
      method: withdrawal.method,
      status: withdrawal.status,
      createdAt: withdrawal.createdAt,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: req.t("errors.serverError", { error: err.message }) });
  }
};


// Get user's withdrawals
const getUserWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ user: req.user._id });
    res.status(200).json(withdrawals);
  } catch (err) {
    res
      .status(500)
      .json({ message: req.t("errors.serverError", { error: err.message }) });
  }
};

// Admin: get all withdrawals
const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 }); // latest first
    res.status(200).json(withdrawals);
  } catch (err) {
    res
      .status(500)
      .json({ message: req.t("errors.serverError", { error: err.message }) });
  }
};

// Admin: update status
const updateWithdrawalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: req.t("errors.invalidStatus") });
    }

    const withdrawal = await Withdrawal.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!withdrawal)
      return res
        .status(404)
        .json({ message: req.t("errors.withdrawalNotFound") });

    res.status(200).json(withdrawal);
  } catch (err) {
    res
      .status(500)
      .json({ message: req.t("errors.serverError", { error: err.message }) });
  }
};

module.exports = {
  requestWithdrawal,
  getUserWithdrawals,
  getAllWithdrawals,
  updateWithdrawalStatus,
};
