const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { AppError, catchAsync } = require('../middleware/errorMiddleware');

// User Registration
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new AppError('Email already registered', 400));

  // 🚫 Do NOT accept role from client, always default to help_seeker
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: 'help_seeker' // enforce schema default explicitly
  });

  const token = generateToken(user._id);

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        role: user.role
      },
      token
    }
  });
});

// User Login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new AppError('Invalid email or password', 401));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new AppError('Invalid email or password', 401));

  // ---------- ADD THIS BLOCK ----------
  if (user.role === 'volunteer') {
    const Volunteer = require('../models/Volunteer');
    const volunteer = await Volunteer.findOne({ userId: user._id });
    if (!volunteer)
      return next(new AppError('Volunteer profile missing', 400));

    if (volunteer.status !== 'approved') {
      return next(
        new AppError(
          'Your account is not approved yet. Please contact admin.',
          403
        )
      );
    }
  }

  const token = generateToken(user._id);

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        role: user.role
      },
      token
    }
  });
});

// Get current user (profile)
exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ status: 'success', data: { user } });
});

// Update password
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  const { currentPassword, newPassword } = req.body;

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  user.password = newPassword;
  await user.save();

  const token = generateToken(user._id);
  res.status(200).json({ status: 'success', message: 'Password updated successfully', token });
});
