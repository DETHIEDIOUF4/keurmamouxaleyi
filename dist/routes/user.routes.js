"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Routes publiques
router.post('/login', user_controller_1.authUser);
router.post('/register', user_controller_1.registerUser);
// Routes protégées
router.get('/profile', auth_1.protect, user_controller_1.getUserProfile);
router.put('/profile', auth_1.protect, user_controller_1.updateUserProfile);
// Routes admin
router.get('/', auth_1.protect, auth_1.admin, user_controller_1.getUsers);
router.get('/:id', auth_1.protect, auth_1.admin, user_controller_1.getUserById);
router.put('/:id', auth_1.protect, auth_1.admin, user_controller_1.updateUser);
router.delete('/:id', auth_1.protect, auth_1.admin, user_controller_1.deleteUser);
exports.default = router;
