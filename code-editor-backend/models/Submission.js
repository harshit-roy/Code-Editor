const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  code: String,
  language: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Submission", submissionSchema);
