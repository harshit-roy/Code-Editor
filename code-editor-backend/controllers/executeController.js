const axios = require("axios");
const Submission = require("../models/Submission");
const Question = require("../models/Question");
const apiUrl = process.env.JUDGE0_API;
const languageMap = {
  cpp: 54,
  java: 62,
  python: 71,
};

const runCode = async (req, res) => {
  const { code, language, questionId, runType } = req.body;

  if (!languageMap[language]) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  const question = await Question.findById(questionId);
  if (!question) return res.status(404).json({ error: "Question not found" });

  const relevantTestCases = question.testCases.filter((tc) =>
    runType === "submit" ? true : !tc.isHidden
  );

  const testResults = [];

  for (const testCase of relevantTestCases) {
    try {
      const submission = await axios.post(
        `${apiUrl}/submissions?base64_encoded=false&wait=true`,
        {
          source_code: code,
          stdin: testCase.input,
          language_id: languageMap[language],
        },
        {
          headers: {
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const { stdout, stderr } = submission.data;

      testResults.push({
        input: testCase.input,
        expected: testCase.output,
        output: stdout?.trim() || stderr,
        passed: stdout?.trim() === testCase.output,
      });
    } catch (error) {
      return res.status(500).json({ error: "Judge0 error", details: error });
    }
  }

  const allPassed = testResults.every((t) => t.passed);

  // Save solution only on submit and if all test cases passed
  if (runType === "submit" && allPassed) {
    await Submission.create({ questionId, code, language });
    await Question.findByIdAndUpdate(questionId, { isSolved: true });
  }

  res.status(200).json({ testResults, allPassed });
};

module.exports = { runCode };
