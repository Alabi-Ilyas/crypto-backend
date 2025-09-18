const User = require("../models/User");
const Investment = require("../models/Investment"); // if you have it
const Plan = require("../models/Plan"); // for profits or invested stats
const Withdrawal = require("../models/Withdrawal");
const Transaction = require("../models/Transaction");
const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: req.t("errors.accessDenied") });
    }

    const users = await User.find().select("-password"); // hide passwords
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: req.t("errors.serverError", { error: err.message }) });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // e.g., "admin", "user"

    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: req.t("errors.userNotFound") });

    user.role = role;
    await user.save();

    res.status(200).json({ message: req.t("success.roleUpdated"), user });
  } catch (err) {
    res
      .status(500)
      .json({ message: req.t("errors.serverError", { error: err.message }) });
  }
};

// Global stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalInvested = await Investment.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalProfit = await Investment.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: null, total: { $sum: "$profit" } } },
    ]);

    // ✅ count ALL pending transactions
    const pendingTransactions = await Transaction.countDocuments({
      status: "pending",
    });

    res.status(200).json({
      totalUsers,
      totalInvested: totalInvested[0]?.total || 0,
      totalProfit: totalProfit[0]?.total || 0,
      pendingTransactions, // renamed
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: req.t("errors.serverError", { error: err.message }) });
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  getStats,
};
