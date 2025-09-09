require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const storyRoutes = require("./routes/storyRoutes");


// Import routes
const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/public');
const contactRoutes = require("./routes/contactRoutes");
const reportRoutes = require("./routes/reportRoutes");
const volunteerRoutes = require('./routes/volunteerRoutes');
const moderatorRoutes = require("./routes/moderatorRoutes");
const campaignRoutes = require('./routes/campaignRoutes');
// Import middleware
const { errorHandler } = require("./middleware/errorMiddleware");

// Import database connection
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: "Too many requests, please try again later.",
});
app.use("/api/", limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/reports", reportRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/moderator", moderatorRoutes);
// after other app.use routes
app.use("/api/campaigns", campaignRoutes);



// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Yuva Savera API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Default route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Yuva Savera API",
    version: "1.0.0",
    docs: "/api/docs",
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`);
});