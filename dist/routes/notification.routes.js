"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("../controllers/notification.controller");
const router = express_1.default.Router();
// Route pour établir la connexion SSE
router.get('/notifications', notification_controller_1.setupSSEConnection);
exports.default = router;
