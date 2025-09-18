const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createMethod,
  getUserMethods,
  deleteMethod,
} = require("../controllers/withdrawalMethodController");

router.post("/", protect, createMethod);
router.get("/user", protect, getUserMethods);
router.delete("/:id", protect, deleteMethod);

module.exports = router;
