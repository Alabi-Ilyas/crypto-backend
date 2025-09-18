const Investment = require("../models/Investment");
const Plan = require("../models/Plan");
const mongoose = require("mongoose");
// Start a new investment
const createInvestment = async (req, res) => {
  try {
    const { planId, amount } = req.body;

    // Find plan
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "errors.planNotFound" });
    }

    const profitPercent =
      typeof plan.profitPercent === "number" && !isNaN(plan.profitPercent)
        ? plan.profitPercent
        : 0;

    const profit = (amount * profitPercent) / 100;

    const investment = await Investment.create({
      user: req.user._id,
      plan: plan._id,
      amount,
      profit,
      endDate: plan.endDate,
      status: "pending", // keep investment itself pending until confirmed
    });

    console.log("Incoming Investment Request:", req.body);

    res.status(201).json({
      message: "success.investmentCreated",
      investment,
    });
  } catch (error) {
    console.error("Error creating investment:", error.message, error.stack);
    res
      .status(500)
      .json({ message: "errors.serverError", error: error.message });
  }
};

// Get investments of logged-in user
const getUserInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user._id }).populate(
      "plan"
    );
    res.status(200).json(investments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "errors.serverError", error: error.message });
  }
};

// Admin: Get all investments
const getAllInvestments = async (req, res) => {
  try {
    const investments = await Investment.find().populate("user plan");
    res.status(200).json(investments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "errors.serverError", error: error.message });
  }
};

// Admin: Update investment status

// Admin: Update investment status
const updateInvestmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("Incoming update request →", { id, status }); // 👀 Debug log

    const validStatuses = ["active", "completed", "cancelled", "pending"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "errors.invalidStatus" });
    }

    const investment = await Investment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("user plan");

    if (!investment) {
      return res.status(404).json({ message: "errors.investmentNotFound" });
    }

    res.status(200).json({
      message: "success.investmentUpdated",
      investment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createInvestment,
  getUserInvestments,
  getAllInvestments,
  updateInvestmentStatus,
};
