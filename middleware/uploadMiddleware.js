const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// For stories (images)
const storyStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "yuva_savera_stories",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) =>
      `${Date.now()}-${file.originalname.split(".")[0]}`,
  },
});
const uploadStory = multer({ storage: storyStorage });

// For volunteers (id proof, docs)
const fileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "yuva_savera_volunteers",
    resource_type: "auto",
    allowed_formats: ["jpeg", "jpg", "png", "pdf"],
    public_id: (req, file) =>
      `${Date.now()}-${file.originalname.split(".")[0]}`,
  },
});
const uploadFile = multer({ storage: fileStorage });

// For requests (videos)
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "yuva_savera_videos",
    resource_type: "video",
    allowed_formats: ["mp4", "avi", "mkv", "mov"],
    public_id: (req, file) =>
      `${Date.now()}-${file.originalname.split(".")[0]}`,
  },
});
const uploadVideo = multer({ storage: videoStorage });


// NEW: campaign storage (keeps assets separated)
const campaignStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "yuva_savera_campaigns",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => `${Date.now()}-${file.originalname.split(".")[0]}`,
  },
});
const uploadCampaign = multer({ storage: campaignStorage });

module.exports = {
  uploadStory, // for stories
  uploadFile,  // for volunteers
  uploadVideo,
  uploadCampaign, 
};
