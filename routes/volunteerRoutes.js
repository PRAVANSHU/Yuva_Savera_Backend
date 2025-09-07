const express = require("express");
const router = express.Router();
const volunteerController = require("../controllers/volunteerController");
const { uploadFile } = require("../middleware/uploadMiddleware");

// Registration with file upload
router.post(
  "/register",
  uploadFile.single("idProof"),
  volunteerController.registerVolunteer
);

module.exports = router;
