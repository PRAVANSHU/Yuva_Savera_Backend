const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const reportController = require("../controllers/reportController");

const router = express.Router();

// Protect all routes → only logged-in users can access
router.use(protect);

// User creates a report
router.post("/", reportController.createReport);

// Core Admin only → fetch all reports
router.get("/", restrictTo("core_admin"), reportController.getAllReports);

// Core Admin only → update report status
router.patch("/:id/status", restrictTo("core_admin"), reportController.updateReportStatus);

module.exports = router;
