const User = require("../models/User");
const HelpRequest = require("../models/HelpRequest");
const { catchAsync, AppError } = require("../middleware/errorMiddleware");


// ✅ Get all users (Core Admin only)
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({
    status: "success",
    results: users.length,
    users,
  });
});


// ✅ Approve or reject help requests
exports.approveRequest = catchAsync(async (req, res, next) => {
  const { requestId, action } = req.body;
  if (!requestId || !["approve", "reject"].includes(action)) {
    return next(new AppError("Invalid request or action", 400));
  }

  const request = await HelpRequest.findById(requestId);
  if (!request) return next(new AppError("Request not found", 404));

  if (action === "approve") {
    request.status = "Approved";
    request.isPublic = true;
  } else {
    request.status = "Rejected";
    request.isPublic = false;
  }
  await request.save();

  res.status(200).json({
    status: "success",
    message: `Request ${action}d successfully`,
  });
});


// ✅ Create Moderator (Core Admin only)
exports.createModerator = catchAsync(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  const role = "moderator"; // fixed role

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new AppError("Email already registered", 400));

  const user = await User.create({ name, email, phone, password, role });

  res.status(201).json({
    status: "success",
    message: "Moderator created successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});


// ✅ Create Admin (Core Admin only — district_lead or moderator)
exports.createAdmin = catchAsync(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;

  if (!["district_lead", "moderator"].includes(role)) {
    return next(new AppError("Invalid role", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new AppError("Email already registered", 400));

  const user = await User.create({ name, email, phone, password, role });

  res.status(201).json({
    status: "success",
    message: `${role} created successfully`,
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    },
  });
});


// ✅ Update user active status
exports.updateUserStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const user = await User.findById(id);
  if (!user) return next(new AppError("User not found", 404));

  user.isActive = isActive;
  await user.save();

  res.status(200).json({
    status: "success",
    message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
    },
  });
});


// ✅ View all help requests (Moderator, District Lead, Core Admin)
exports.viewRequests = catchAsync(async (req, res, next) => {
  const requests = await HelpRequest.find()
    .populate("submittedBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: requests.length,
    requests,
  });
});
