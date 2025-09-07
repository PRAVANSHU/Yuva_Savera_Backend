const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const ContactMessage = require("../models/ContactMessage");

const router = express.Router();

// ------------------------
// Public route: Submit contact form
// ------------------------
router.post("/", async (req, res) => {
  try {
    let { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ status: "fail", message: "All fields are required" });
    }

    // Trim input
    name = name.trim();
    email = email.trim();
    message = message.trim();

    // Simple email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ status: "fail", message: "Invalid email format" });
    }

    // Create message
    const newMessage = await ContactMessage.create({ name, email, message });

    res.status(201).json({
      status: "success",
      message: "Message submitted successfully!",
      data: { message: newMessage },
    });
  } catch (err) {
    console.error("Error creating contact message:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ------------------------
// Protected routes (Core Admin only)
// ------------------------
router.use(protect);

// Fetch all messages (Core Admin only)
router.get("/", restrictTo("core_admin"), async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      results: messages.length,
      data: { messages },
    });
  } catch (err) {
    console.error("Error fetching contact messages:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
