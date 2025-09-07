const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();

router.use(protect);
router.get("/", restrictTo("core_admin", "district_lead", "moderator"), dashboardController.getDashboardData);

module.exports = router;
