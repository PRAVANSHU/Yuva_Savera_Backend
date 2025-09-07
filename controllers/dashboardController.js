const HelpRequest = require("../models/HelpRequest");
const User = require("../models/User");

exports.getDashboardData = async (req, res) => {
  try {
    // ✅ Counts
    const totalRequests = await HelpRequest.countDocuments();
    const pending = await HelpRequest.countDocuments({ status: "Pending" });  // match schema
    const resolved = await HelpRequest.countDocuments({ status: "Resolved" });

    const users = await User.countDocuments({ role: "help_seeker" });
    const volunteers = await User.countDocuments({ role: "volunteer" });

    // ✅ Status breakdown
    const statusAgg = await HelpRequest.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusData = statusAgg.map(s => ({
      name: s._id.replace(/_/g, " "), // pretty labels e.g. in_progress → in progress
      value: s.count,
    }));

    // ✅ Trend (last 6 months)
    const trendAgg = await HelpRequest.aggregate([
      {
        $group: {
          _id: { $substr: ["$createdAt", 0, 7] }, // "YYYY-MM"
          requests: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const trendData = trendAgg.map(t => {
      const [year, month] = t._id.split("-");
      return {
        month: new Date(year, month - 1).toLocaleString("default", { month: "short" }),
        requests: t.requests,
      };
    });

    // ✅ Recent activity
    const recent = await HelpRequest.find().sort({ createdAt: -1 }).limit(5);
    const activity = recent.map(r => `Request "${r.title}" created with status ${r.status}`);

    // ✅ Send response
    res.status(200).json({
      status: "success",
      data: {
        stats: { totalRequests, pending, resolved, users, volunteers },
        statusData,
        trendData,
        activity,
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
