const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "yuva_savera_videos", // Cloudinary folder name
    resource_type: "video", // Important for videos
    allowed_formats: ["mp4", "avi", "mkv", "mov"],
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`,
  },
});

const upload = multer({ storage });

module.exports = upload;
