const SecurityEvent = require("../models/SecurityEvents");

const getSecurityEvents = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: req.t("errors.accessDenied") });
    }

    const events = await SecurityEvent.find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: req.t("errors.serverError", { error: err.message }) });
  }
};

module.exports = { getSecurityEvents };
