import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../services/cloudinary';

const router = express.Router();

// Configure stockage Cloudinary
const storage = new CloudinaryStorage({
	cloudinary,
	params: async (_req, file) => ({
		folder: 'hellogassy3',
		allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
		public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`,
	}),
});

const upload = multer({ storage });

// Upload image unique: champ 'image'
router.post('/', upload.single('image'), (req, res) => {
	// @ts-ignore - multer-storage-cloudinary fournit path (URL) dans file
	const imageUrl = req.file?.path;
	if (!imageUrl) {
		return res.status(400).json({ message: 'No file uploaded' });
	}
	return res.json({ imageUrl });
});

// Upload multiple: champ 'images'
router.post('/multiple', upload.array('images', 10), (req, res) => {
	// @ts-ignore - files contient path
	const files = (req.files || []) as any[];
	const imageUrls = files.map((f) => f.path).filter(Boolean);
	if (!imageUrls.length) {
		return res.status(400).json({ message: 'No files uploaded' });
	}
	return res.json({ imageUrls });
});

export default router;
