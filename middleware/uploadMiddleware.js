const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "yuva_savera_uploads",
      resource_type: "auto", // auto-detect image/video/pdf
      allowed_formats: ["jpg", "jpeg", "png", "pdf", "mp4", "avi", "mkv", "mov"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

// ✅ This is the multer instance
const upload = multer({ storage });

// Export consistently
module.exports = upload;
