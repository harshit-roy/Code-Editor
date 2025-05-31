const express = require("express");
const router = express.Router();
const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  markAsDone,
} = require("../controllers/questionController");
const { verifyToken, isAdmin } = require("../middleware/auth");

router.post("/create", createQuestion);
router.get("/", getAllQuestions);
router.get("/:id", getQuestionById);
router.put("/:id/done", markAsDone);

// Protect this route with verifyToken and isAdmin middleware
router.post("/", verifyToken, isAdmin, createQuestion);

module.exports = router;
