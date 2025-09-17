"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    id: { type: Number, unique: true, sparse: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    sizes: [{ type: String }],
    size: { type: String },
    images: [{ type: String, required: true }],
    stock: { type: String, required: true, default: '0' },
    price: { type: Number, required: true, min: 0 },
    prevprice: { type: Number, required: true, min: 0 },
    qty: { type: Number },
    discount: { type: Number, min: 0 },
    totalprice: { type: Number, min: 0 },
    rating: {
        rate: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0, min: 0 }
    }
}, {
    timestamps: true
});
exports.Product = mongoose_1.default.model('Product', productSchema);
exports.default = mongoose_1.default.model('Product', productSchema);
