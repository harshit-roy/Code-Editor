const mongoose = require("mongoose");

const userDashboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  solvedQuestionsCount: Number,
  timeSpentMinutes: Number,
  lastLogin: Date,
});

module.exports = mongoose.model("UserDashboard", userDashboardSchema);
