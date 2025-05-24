const mongoose = require("mongoose");

const TestCaseSchema = new mongoose.Schema({
  input: String,
  output: String,
  isHidden: { type: Boolean, default: false },
});

const QuestionSchema = new mongoose.Schema({
  title: String,
  description: String,
  language: [String], // supported languages
  testCases: [TestCaseSchema],
  solution: {
    type: Map,
    of: String, // language => solution code
  },
  done: { type: Boolean, default: false },
});

module.exports = mongoose.model("Question", QuestionSchema);
