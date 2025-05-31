const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");
console.log("authenticate is function:", typeof authenticate === "function");
console.log("isAdmin is function:", typeof isAdmin === "function");
const Question = require("../models/Question");
const Submission = require("../models/Submission");
const User = require("../models/User");

router.get("/stats", verifyToken, isAdmin, async (req, res) => {
  try {
    const [totalQuestions, totalSubmissions, totalUsers] = await Promise.all([
      Question.countDocuments(),
      Submission.countDocuments(),
      User.countDocuments(),
    ]);
    res.json({ totalQuestions, totalSubmissions, totalUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
