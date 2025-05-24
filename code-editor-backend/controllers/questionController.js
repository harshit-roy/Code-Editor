const Question = require("../models/Question");

// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single question
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update question "done" status and save solution
exports.markAsDone = async (req, res) => {
  try {
    const { code, language } = req.body;
    const question = await Question.findById(req.params.id);
    question.done = true;
    question.solution.set(language, code);
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
