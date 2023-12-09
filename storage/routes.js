import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const CLOUD_NAME = process.env.CLOUD_NAME;
const API_KEY = process.env.CLOUD_API_KEY;
const API_SECRET = process.env.CLOUD_API_SECRET;

function StorageRoutes(app) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
  });

  // Configure multer-storage-cloudinary
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "belo-users", // folder name in Cloudinary
      format: async (req, file) => "png", // or 'jpeg', 'jpg'
    },
  });

  // Configure Multer
  const parser = multer({ storage: storage });

  // Handler for image upload
  const uploadImage = async (req, res) => {
    try {
      // File is automatically uploaded to Cloudinary by Multer
      const imageUUID = req.file.path; // Path of the uploaded image in Cloudinary

      res.json({ public_id: imageUUID });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Define route for image upload
  app.post("/api/storage/upload", parser.single("file"), uploadImage);
}
export default StorageRoutes;
