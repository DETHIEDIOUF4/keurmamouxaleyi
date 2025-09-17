import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getProductsByCategory,
  getProductStats
} from '../controllers/product.controller';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

// Routes publiques
router.get('/top', getTopProducts);
router.get('/category/:categoryName', getProductsByCategory);

// Routes protégées/admin
router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.get('/stats', protect, admin, getProductStats);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/reviews')
  .post(protect, createProductReview);

export default router; 