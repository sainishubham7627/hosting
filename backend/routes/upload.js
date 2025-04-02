const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let resourceType = "image"; // Default to image
    if (file.mimetype.startsWith("video/")) {
      resourceType = "video"; // Change to video if file is a video
    }

    return {
      folder: "uploads", // Folder name in Cloudinary
      resource_type: resourceType, // Dynamically set the resource type
      allowed_formats: ["jpg", "png", "jpeg", "mp4", "pdf"],
    };
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
