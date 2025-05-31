const UserDashboard = require("../models/UserDashboard");

const getUserDashboard = async (req, res) => {
  try {
    const userId = req.params.userId;
    const dashboard = await UserDashboard.findOne({ userId });
    if (!dashboard)
      return res.status(404).json({ error: "User dashboard not found" });

    res.json(dashboard);
  } catch (err) {
    console.error("UserDashboard fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getUserDashboard };
