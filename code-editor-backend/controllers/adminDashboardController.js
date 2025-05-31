const AdminDashboard = require("../models/AdminDashboard");

const getAdminDashboard = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const dashboard = await AdminDashboard.findOne({ adminId });
    if (!dashboard)
      return res.status(404).json({ error: "Admin dashboard not found" });

    res.json(dashboard);
  } catch (err) {
    console.error("AdminDashboard fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getAdminDashboard };
