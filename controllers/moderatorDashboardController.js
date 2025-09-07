const HelpRequest = require("../models/HelpRequest");
const Report = require("../models/Report");

exports.getModeratorDashboard = async (req, res) => {
  try {
    // Count pending requests waiting for moderator action
    const pendingContent = await HelpRequest.countDocuments({ adminStatus: "pending" });

    // Count reported content still open
    const reportedContent = await Report.countDocuments({ status: "pending" });

    res.status(200).json({
      status: "success",
      stats: {
        pendingContent,
        reportedContent,
      },
    });
  } catch (err) {
    console.error("Moderator Dashboard Error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
