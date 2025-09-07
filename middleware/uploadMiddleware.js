const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "yuva_savera_videos",
    resource_type: "video",
    allowed_formats: ["mp4", "avi", "mkv", "mov"],
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`,
  },
});

const upload = multer({ storage });

const fileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'yuva_savera_volunteers',
    resource_type: 'auto',
    allowed_formats: ['jpeg','jpg', 'png', 'pdf'],
    // public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`,
  },
});

const uploadFile = multer({storage: fileStorage });

module.exports = {upload, uploadFile};
