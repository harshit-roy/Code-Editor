const express = require("express");
const router = express.Router();
const { runCode } = require("../controllers/executeController");

router.post("/run", runCode);

module.exports = router;
