const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ✅ One storage for both images & videos
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = "image";
    let folder = "yuva_savera_images";

    // Check MIME type to decide resource type
    if (file.mimetype.startsWith("video/")) {
      resourceType = "video";
      folder = "yuva_savera_videos";
    }

    return {
      folder: folder,
      resource_type: resourceType,
      allowed_formats: ["jpg", "jpeg", "png", "mp4", "avi", "mkv", "mov"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
