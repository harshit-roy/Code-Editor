const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");
const AdminDashboard = require("../models/AdminDashboard"); // make sure you have this model

// Existing route
router.get("/stats", verifyToken, isAdmin, async (req, res) => {
  try {
    const [totalQuestions, totalSubmissions, totalUsers] = await Promise.all([
      require("../models/Question").countDocuments(),
      require("../models/Submission").countDocuments(),
      require("../models/User").countDocuments(),
    ]);
    res.json({ totalQuestions, totalSubmissions, totalUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// New admin dashboard route by adminId
router.get("/dashboard/:adminId", verifyToken, isAdmin, async (req, res) => {
  try {
    const { adminId } = req.params;
    const dashboard = await AdminDashboard.findOne({ adminId });

    if (!dashboard) {
      return res.status(404).json({ error: "Admin dashboard not found" });
    }

    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
