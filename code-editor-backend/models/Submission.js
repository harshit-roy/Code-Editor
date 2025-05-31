const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  code: String,
  language: String,
  timeSpent: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Submission", submissionSchema);
