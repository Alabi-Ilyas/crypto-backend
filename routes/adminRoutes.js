const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const { getUsers, updateUserRole, getStats } = require("../controllers/adminController");

const router = express.Router();

// ✅ All routes here require login + admin access
router.use(protect, admin);

router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);
router.get("/stats", getStats);

module.exports = router;
