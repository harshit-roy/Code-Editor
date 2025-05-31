const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const Submission = require("../models/Submission");

router.get("/:userId/dashboard", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const submissions = await Submission.find({ userId });

    const solvedCount = submissions.length;
    const monthlyData = {};
    submissions.forEach((s) => {
      const month = new Date(s.createdAt).toLocaleString("default", {
        month: "short",
      });
      monthlyData[month] = (monthlyData[month] || 0) + (s.timeSpent || 1);
    });

    res.json({ solvedCount, monthlyData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
