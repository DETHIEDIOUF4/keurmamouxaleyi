"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const order_controller_1 = require("../controllers/order.controller");
const router = express_1.default.Router();
router.route('/')
    .post(order_controller_1.createOrder)
    .get(auth_1.protect, order_controller_1.getOrders);
router.route('/myorders')
    .get(auth_1.protect, order_controller_1.getMyOrders);
router.route('/:id')
    .get(auth_1.protect, order_controller_1.getOrderById);
router.route('/:id/pay')
    .put(auth_1.protect, order_controller_1.updateOrderToPaid);
router.route('/:id/deliver')
    .put(auth_1.protect, auth_1.admin, order_controller_1.updateOrderToDelivered);
router.route('/:id/status')
    .put(auth_1.protect, auth_1.admin, order_controller_1.updateOrderStatus);
router.get('/stats', auth_1.protect, auth_1.admin, order_controller_1.getOrderStats);
exports.default = router;
