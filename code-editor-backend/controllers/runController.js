const runCode = async (req, res) => {
  try {
    const { code, language, questionId, runType } = req.body;

    // compiler or interpreter pending h !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    console.log("Running code:", code);
    res.status(200).json({ output: "Code ran successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Execution failed", details: err.message });
  }
};

module.exports = { runCode };
