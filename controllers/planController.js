const Plan = require("../models/Plan");

// Get all plans
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch plans.", error: error.message });
  }
};

// Create a new plan (Admin)
const createPlan = async (req, res) => {
  try {
    const {
      planName,
      profitPercent,
      durationHours,
      minAmount,
      maxAmount,
      referralBonusPercent,
      status,
    } = req.body;

    const plan = await Plan.create({
      planName,
      profitPercent,
      durationHours,
      minAmount,
      maxAmount,
      referralBonusPercent,
      status,
    });

    res.status(201).json({
      message: "Plan created successfully.",
      plan,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create plan.", error: error.message });
  }
};

// Update a plan by ID (Admin)
const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPlan = await Plan.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedPlan)
      return res.status(404).json({ message: "Plan not found." });

    res.status(200).json({
      message: "Plan updated successfully.",
      updatedPlan,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update plan.", error: error.message });
  }
};

// Delete a plan by ID (Admin)
const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlan = await Plan.findByIdAndDelete(id);

    if (!deletedPlan)
      return res.status(404).json({ message: "Plan not found." });

    res.status(200).json({ message: "Plan deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete plan.", error: error.message });
  }
};

module.exports = {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
};
