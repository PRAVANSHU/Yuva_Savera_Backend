const ContactMessage = require("../models/ContactMessage");
const { catchAsync } = require("../middleware/errorMiddleware");

// User submits contact form
exports.createMessage = catchAsync(async (req, res) => {
  const message = await ContactMessage.create(req.body);
  res.status(201).json({
    success: true,
    message: "Message submitted successfully!",
  });
});

// Core admin fetches all messages
exports.getAllMessages = catchAsync(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.status(200).json({
    status: "success",
    results: messages.length,
    messages,
  });
});
