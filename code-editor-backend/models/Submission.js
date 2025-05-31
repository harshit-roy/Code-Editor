const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  timeSpent: { type: Number, default: 0 }, // time in seconds or ms
  passed: { type: Boolean, default: false }, // track if all test cases passed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Submission", submissionSchema);
