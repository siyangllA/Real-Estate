import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'real_estate',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB limit
});

export default upload;


