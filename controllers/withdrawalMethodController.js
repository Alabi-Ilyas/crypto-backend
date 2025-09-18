const WithdrawalMethod = require("../models/WithdrawalMethod");

exports.createMethod = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { methodName, accountDetails, isDefault } = req.body;

    if (!methodName || !accountDetails) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const method = await WithdrawalMethod.create({
      user: req.user._id,
      methodName,
      accountDetails,
      isDefault: Boolean(isDefault),
    });

    res.status(201).json({
      message: "Withdrawal method created successfully",
      method,
    });
  } catch (err) {
    console.error("Error creating withdrawal method:", err);
    res.status(500).json({
      message: "Server error while creating withdrawal method",
      error: err.message,
    });
  }
};

exports.getUserMethods = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const methods = await WithdrawalMethod.find({ user: req.user._id });
    res.status(200).json(methods);
  } catch (err) {
    console.error("Error fetching withdrawal methods:", err);
    res.status(500).json({
      message: "Server error while fetching withdrawal methods",
      error: err.message,
    });
  }
};

exports.deleteMethod = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const method = await WithdrawalMethod.findOneAndDelete({ _id: id, user: req.user._id });

    if (!method) {
      return res.status(404).json({ message: "Withdrawal method not found" });
    }

    res.status(200).json({ message: "Withdrawal method deleted successfully" });
  } catch (err) {
    console.error("Error deleting withdrawal method:", err);
    res.status(500).json({
      message: "Server error while deleting withdrawal method",
      error: err.message,
    });
  }
};
