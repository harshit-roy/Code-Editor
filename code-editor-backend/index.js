const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const questionRoutes = require("./routes/questionRoutes");
const executeRoutes = require("./routes/executeRoutes");
const { runCode } = require("./controllers/runController");

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/questions", questionRoutes);
app.use("/api/execute", executeRoutes);
app.post("/api/run", runCode);

// DB Connection & Server Start
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("DB Connection Error:", err));
