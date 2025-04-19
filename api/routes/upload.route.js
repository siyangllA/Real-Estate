import express from 'express';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  try {
    const imageUrl = req.file.path; 
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error });
  }
});

export default router;
