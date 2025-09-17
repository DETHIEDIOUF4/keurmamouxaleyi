"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Routes publiques
router.get('/top', product_controller_1.getTopProducts);
router.get('/category/:categoryName', product_controller_1.getProductsByCategory);
// Routes protégées/admin
router.route('/')
    .get(product_controller_1.getProducts)
    .post(auth_1.protect, auth_1.admin, product_controller_1.createProduct);
router.get('/stats', auth_1.protect, auth_1.admin, product_controller_1.getProductStats);
router.route('/:id')
    .get(product_controller_1.getProductById)
    .put(auth_1.protect, auth_1.admin, product_controller_1.updateProduct)
    .delete(auth_1.protect, auth_1.admin, product_controller_1.deleteProduct);
router.route('/:id/reviews')
    .post(auth_1.protect, product_controller_1.createProductReview);
exports.default = router;
