const Report = require("../models/Report");
const { catchAsync, AppError } = require("../middleware/errorMiddleware");

// 1. Create a new report (User)
exports.createReport = catchAsync(async (req, res, next) => {
  const { title, description, targetType, targetId } = req.body;

  // Validate targetType if provided
  if (targetType && !["User", "HelpRequest"].includes(targetType)) {
    return next(new AppError("Invalid target type", 400));
  }

  // Build report object
  const reportData = {
    title,
    description,
    submittedBy: req.user._id, // logged-in user
  };

  // Only set targetType and targetId if provided
  if (targetType) reportData.targetType = targetType;
  if (targetId) reportData.targetId = targetId;

  const report = await Report.create(reportData);

  res.status(201).json({
    status: "success",
    message: "Report submitted successfully",
    data: report,
  });
});

// 2. Get all reports (Core Admin only)
exports.getAllReports = catchAsync(async (req, res) => {
  const reports = await Report.find()
    .populate("submittedBy", "name email")
    .populate("targetId") // dynamically populates User or HelpRequest
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: reports.length,
    reports,
  });
});

// 3. Update report status (Core Admin only)
exports.updateReportStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "reviewed", "resolved"].includes(status)) {
    return next(new AppError("Invalid status", 400));
  }

  const report = await Report.findById(id);
  if (!report) return next(new AppError("Report not found", 404));

  report.status = status;
  await report.save();

  res.status(200).json({
    status: "success",
    message: `Report marked as ${status}`,
    data: report,
  });
});
