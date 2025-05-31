const axios = require("axios");
const Question = require("../models/Question");
const Submission = require("../models/Submission");

const languageMap = {
  cpp: 54,
  java: 62,
  python: 71,
};

const runCode = async (req, res) => {
  try {
    const { code, language, questionId, runType } = req.body;

    if (!code || !language || !questionId || !runType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const languageId = languageMap[language.toLowerCase()];
    if (!languageId) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    // Fetch question & test cases
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Select test cases based on runType
    let testCases = [];
    if (runType === "run") {
      testCases = question.testCases.filter((tc) => !tc.hidden);
    } else if (runType === "submit") {
      testCases = question.testCases;
    } else {
      return res.status(400).json({ error: "Invalid runType" });
    }

    const results = [];
    let allPassed = true;

    for (const testCase of testCases) {
      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
        {
          source_code: code,
          language_id: languageId,
          stdin: testCase.input,
        },
        {
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key": process.env.JUDGE0_API_KEY,
            "content-type": "application/json",
          },
        }
      );

      const data = response.data;
      const actualOutput = data.stdout ? data.stdout.trim() : "";
      const expectedOutput = testCase.output.trim();

      const passed = actualOutput === expectedOutput;
      if (!passed) allPassed = false;

      results.push({
        input: testCase.input,
        expectedOutput,
        actualOutput,
        passed,
        stderr: data.stderr,
        compile_output: data.compile_output,
        message: data.message,
      });
    }

    // Save submission only if runType=submit and all passed
    if (runType === "submit" && allPassed) {
      const userId = req.user ? req.user.id : null;

      const newSubmission = new Submission({
        userId,
        questionId,
        code,
        language,
        timeSpent: 0, // optionally track this
        passed: true,
      });

      await newSubmission.save();
    }

    return res.json({
      results,
      allPassed,
      message: allPassed ? "All test cases passed!" : "Some test cases failed",
    });
  } catch (err) {
    console.error("runCode error:", err);
    return res
      .status(500)
      .json({ error: "Execution failed", details: err.message });
  }
};

module.exports = { runCode };
