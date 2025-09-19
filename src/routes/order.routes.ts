import express from 'express';
import { protect, admin } from '../middleware/auth';
import {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrderStats
} from '../controllers/order.controller';

const router = express.Router();

router.route('/')
  .post(createOrder)
  .get(protect, getOrders);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/pay')
  .put(protect, updateOrderToPaid);

router.route('/:id/deliver')
  .put(protect, admin, updateOrderToDelivered);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

router.get('/stats', protect, admin, getOrderStats);

export default router; 