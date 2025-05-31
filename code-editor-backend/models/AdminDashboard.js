const mongoose = require("mongoose");

const adminDashboardSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stats: {
    totalUsers: Number,
    activeUsers: Number,
    totalQuestions: Number,
  },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AdminDashboard", adminDashboardSchema);
