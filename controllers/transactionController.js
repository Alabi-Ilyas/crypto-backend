const Transaction = require("../models/Transaction");

const Investment = require("../models/Investment");

// Admin: approve a transaction
exports.approveTransaction = async (req, res) => {
  try {
    // ✅ Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const { id } = req.params; // transaction ID

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Update transaction status
    transaction.status = "approved";
    await transaction.save();

    // If it’s an investment transaction, update the linked investment
    if (transaction.type === "investment" && transaction.investmentId) {
      const investment = await Investment.findById(transaction.investmentId);
      if (investment) {
        investment.status = "active"; // mark investment as active
        await investment.save();
      }
    }

    res.status(200).json({ message: "Transaction approved successfully", transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(transactions);
  } catch (err) {
    res
      .status(500)
      .json({ message: req.t("errors.serverError", { error: err.message }) });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { type, amount, method, reference, status, investmentId } = req.body;

    if (!type || !amount || !method) {
      return res
        .status(400)
        .json({ message: req.t("errors.allFieldsRequired") });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      amount,
      method,
      reference: reference || undefined,
      investmentId: type === "investment" ? investmentId : undefined, // ✅ only for investments
      status: status || "pending",
    });

    res.status(201).json(transaction);
  } catch (err) {
    res
      .status(500)
      .json({ message: req.t("errors.serverError", { error: err.message }) });
  }
};

// Admin: get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("user", "username email")
      .populate("investmentId") // ✅ shows investment details
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
