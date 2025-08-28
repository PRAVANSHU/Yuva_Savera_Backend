const User = require('../models/User');
const { catchAsync, AppError } = require('../middleware/errorMiddleware');

// Get all users (Core Admin only)
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

// Approve or reject requests (District Lead & Core Admin)
exports.approveRequest = catchAsync(async (req, res, next) => {
  const { requestId, action } = req.body; // action: 'approve' or 'reject'

  if (!requestId || !['approve', 'reject'].includes(action)) {
    return next(new AppError('Invalid request or action', 400));
  }

  // Example: update request status (replace with your request model)
  // const request = await Request.findById(requestId);
  // request.status = action;
  // await request.save();

  res.status(200).json({
    status: 'success',
    message: `Request ${action}d successfully`
  });
});

// View requests (Moderator/District Lead/Core Admin)
exports.viewRequests = catchAsync(async (req, res) => {
  // Example: fetch all requests (replace with your request model)
  // const requests = await Request.find();
  const requests = [{ id: 1, title: 'Sample Request', status: 'pending' }];

  res.status(200).json({
    status: 'success',
    results: requests.length,
    data: { requests }
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
    data: { user: { id: user._id, name: user.name, email: user.email, role: user.role } }
  });
});
