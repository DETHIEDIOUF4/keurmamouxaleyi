"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', category_controller_1.getCategories);
router.get('/:id', category_controller_1.getCategoryById);
router.post('/', auth_1.protect, auth_1.admin, category_controller_1.createCategory);
router.put('/:id', auth_1.protect, auth_1.admin, category_controller_1.updateCategory);
router.delete('/:id', auth_1.protect, auth_1.admin, category_controller_1.deleteCategory);
exports.default = router;
