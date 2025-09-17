"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../services/cloudinary"));
const router = express_1.default.Router();
// Configure stockage Cloudinary
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: (_req, file) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            folder: 'hellogassy3',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`,
        });
    }),
});
const upload = (0, multer_1.default)({ storage });
// Upload image unique: champ 'image'
router.post('/', upload.single('image'), (req, res) => {
    var _a;
    // @ts-ignore - multer-storage-cloudinary fournit path (URL) dans file
    const imageUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    if (!imageUrl) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    return res.json({ imageUrl });
});
// Upload multiple: champ 'images'
router.post('/multiple', upload.array('images', 10), (req, res) => {
    // @ts-ignore - files contient path
    const files = (req.files || []);
    const imageUrls = files.map((f) => f.path).filter(Boolean);
    if (!imageUrls.length) {
        return res.status(400).json({ message: 'No files uploaded' });
    }
    return res.json({ imageUrls });
});
exports.default = router;
