const express = require("express");
const router = express.Router();
const {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
} = require("../controllers/planController");

const { protect } = require("../middleware/authMiddleware");

// Public route to get all plans
router.get("/", getPlans);

// Admin routes for managing plans
// These routes now use the simpler express router syntax
router.post("/create", protect, createPlan);
router.put("/:id", protect, updatePlan);
router.delete("/:id", protect, deletePlan);

module.exports = router;
