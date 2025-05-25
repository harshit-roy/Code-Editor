// controllers/runController.js
const runCode = async (req, res) => {
  try {
    const { code, language, questionId, runType } = req.body;

    // You should integrate Judge0 API or your own runner here
    console.log("Running code:", code);
    res.status(200).json({ output: "Code ran successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Execution failed", details: err.message });
  }
};

module.exports = { runCode };
