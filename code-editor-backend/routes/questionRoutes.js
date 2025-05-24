const express = require("express");
const router = express.Router();
const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  markAsDone,
} = require("../controllers/questionController");

router.post("/create", createQuestion);
router.get("/", getAllQuestions);
router.get("/:id", getQuestionById);
router.put("/:id/done", markAsDone);

module.exports = router;
