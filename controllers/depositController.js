const Deposit = require("../models/Deposit");
const Transaction = require("../models/Transaction");
// User creates deposit
const createDeposit = async (req, res) => {
  try {
    const { amount, method, transactionId } = req.body;

    const deposit = await Deposit.create({
      user: req.user._id,
      amount,
      method,
      transactionId,
    });

    // ✅ Log transaction
    await Transaction.create({
      user: req.user._id,
      type: "deposit",
      amount,
      method,
      reference: transactionId,
      status: "pending", // or match deposit status if you add it
    });

    res.status(201).json({ message: req.t("success.depositCreated"), deposit });
  } catch (error) {
    res.status(500).json({ message: req.t("errors.serverError", { error: error.message }) });
  }
};

// User views own deposits
const getUserDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find({ user: req.user._id });
    res.status(200).json(deposits);
  } catch (error) {
    res.status(500).json({ message: req.t("errors.serverError", { error: error.message }) });
  }
};

// Admin views all deposits
const getAllDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find().populate("user", "username email");
    res.status(200).json(deposits);
  } catch (error) {
    res.status(500).json({ message: req.t("errors.serverError", { error: error.message }) });
  }
};

// Admin approves/rejects deposit
const updateDepositStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: req.t("errors.invalidStatus") });
    }

    const deposit = await Deposit.findByIdAndUpdate(id, { status }, { new: true });
    if (!deposit) return res.status(404).json({ message: req.t("errors.depositNotFound") });

    res.status(200).json({ message: req.t("success.depositUpdated"), deposit });
  } catch (error) {
    res.status(500).json({ message: req.t("errors.serverError", { error: error.message }) });
  }
};

module.exports = {
  createDeposit,
  getUserDeposits,
  getAllDeposits,
  updateDepositStatus,
};
