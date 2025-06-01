const axios = require("axios");
const Question = require("../models/Question");
const Submission = require("../models/Submission");

const languageMap = {
  cpp: "cpp",
  java: "java",
  python: "python3",
};

const runCode = async (req, res) => {
  try {
    const { code, language, questionId, runType } = req.body;

    if (!code || !language || !questionId || !runType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const pistonLang = languageMap[language.toLowerCase()];
    if (!pistonLang) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Select test cases
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
        "https://emkc.org/api/v2/piston/execute",
        {
          language: pistonLang,
          version: "*", // always gets latest
          stdin: testCase.input,
          files: [
            {
              name: `Main.${pistonLang === "java" ? "java" : pistonLang}`,
              content: code,
            },
          ],
        }
      );

      const data = response.data;
      const actualOutput = data.run.stdout ? data.run.stdout.trim() : "";
      const expectedOutput = testCase.output.trim();

      const passed = actualOutput === expectedOutput;
      if (!passed) allPassed = false;

      results.push({
        input: testCase.input,
        expectedOutput,
        actualOutput,
        passed,
        stderr: data.run.stderr,
        compile_output: data.compile?.stdout || null,
        message: data.message || null,
      });
    }

    if (runType === "submit" && allPassed) {
      const userId = req.user ? req.user.id : null;

      const newSubmission = new Submission({
        userId,
        questionId,
        code,
        language,
        timeSpent: 0,
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
