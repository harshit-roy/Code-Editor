const axios = require("axios");
const Submission = require("../models/Submission");
const Question = require("../models/Question");

const apiUrl = "https://emkc.org/api/v2/piston";

// Mapping to Piston language names and versions
const languageMap = {
  cpp: { language: "cpp", version: "10.2.0", ext: "cpp" },
  java: { language: "java", version: "15.0.2", ext: "java" },
  python: { language: "python", version: "3.10.0", ext: "py" },
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
      const { language: pistonLang, version, ext } = languageMap[language];

      const response = await axios.post(`${apiUrl}/execute`, {
        language: pistonLang,
        version: version,
        stdin: testCase.input,
        files: [
          {
            name: `main.${ext}`,
            content: code,
          },
        ],
      });

      const { stdout, stderr } = response.data.run;

      testResults.push({
        input: testCase.input,
        expected: testCase.output,
        output: (stdout?.trim() || stderr?.trim() || "").trim(),
        passed: (stdout?.trim() || "") === testCase.output,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Piston error",
        details: error?.response?.data || error.message,
      });
    }
  }

  const allPassed = testResults.every((t) => t.passed);

  if (runType === "submit" && allPassed) {
    await Submission.create({ questionId, code, language });
    await Question.findByIdAndUpdate(questionId, { isSolved: true });
  }

  res.status(200).json({ testResults, allPassed });
};

module.exports = { runCode };
