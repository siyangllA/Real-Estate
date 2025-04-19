import express from 'express';
import upload from '../middleware/upload.js';  

const router = express.Router();


router.post('/upload', upload.single('image'), (req, res) => {
  try {
    res.status(200).json({ imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
