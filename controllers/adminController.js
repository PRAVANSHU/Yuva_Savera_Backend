const User = require('../models/User');
const HelpRequest = require('../models/HelpRequest'); // <-- import your request model
const { catchAsync, AppError } = require('../middleware/errorMiddleware');

// Get all users (Core Admin only)
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

// Approve or reject requests (District Lead & Core Admin)
exports.approveRequest = catchAsync(async (req, res, next) => {
  const { requestId, action } = req.body; // action: 'approve' or 'reject'

  if (!requestId || !['approve', 'reject'].includes(action)) {
    return next(new AppError('Invalid request or action', 400));
  }

  const request = await HelpRequest.findById(requestId);
  if (!request) return next(new AppError('Request not found', 404));

  // Map frontend action to status
  if(action === 'approve'){
    request.status = 'Approved';
    request.isPublic = true; // Make it visible to public
  } else {
    request.status = 'Rejected';
    request.isPublic = false;
  }
  await request.save();

  res.status(200).json({
    status: 'success',
    message: `Request ${action}d successfully`,
  });
});

exports.createModerator = catchAsync(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  // Role is fixed as 'moderator' (not user input to avoid abuse)
  const role = "moderator";

  // Check duplicate
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
      role: user.role
    }
  });
});


// View requests (Moderator/District Lead/Core Admin)
exports.viewRequests = catchAsync(async (req, res) => {
  console.log("🟢 Core Admin Dashboard fetch by user:", req.user?.email, "role:", req.user?.role);
  const requests = await HelpRequest.find().sort({ createdAt: -1 });
  console.log("🟢 Requests fetched from DB:", requests.length);

  // Format requests to match frontend table
  const formattedRequests = requests.map(req => ({
    _id: req._id,
    name: req.submittedBy?.name || 'Anonymous',
    email: req.submittedBy?.email || 'N/A',
    status: req.status,
    title: req.title,
    category: req.category,
    urgency: req.urgencyLevel,
    location: req.location?.address || '',
    createdAt: req.createdAt,
    description: req.description,
    videoUrl: req.media?.video?.url || null
  }));

  console.log("🟢 Formatted Requests for frontend:", formattedRequests);

  res.status(200).json({
    status: 'success',
    results: formattedRequests.length,
    requests: formattedRequests,
  });
});

// Create Admins (Core Admin only)
exports.createAdmin = catchAsync(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;

  if (!['district_lead', 'moderator'].includes(role)) {
    return next(new AppError('Invalid role', 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new AppError('Email already registered', 400));

  const user = await User.create({ name, email, phone, password, role });

  res.status(201).json({
    status: 'success',
    message: `${role} created successfully`,
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    },
  });
});
