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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductStats = exports.getProductsByCategory = exports.getTopProducts = exports.createProductReview = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const product_model_1 = require("../models/product.model");
// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.Product.find({});
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getProducts = getProducts;
// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.Product.findById(req.params.id);
        if (product) {
            res.json(product);
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getProductById = getProductById;
// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = new product_model_1.Product({
            id: req.body.id,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            type: req.body.type,
            sizes: req.body.sizes,
            size: req.body.size,
            images: req.body.images,
            stock: req.body.stock,
            price: req.body.price,
            prevprice: req.body.prevprice,
            qty: req.body.qty,
            discount: req.body.discount,
            totalprice: req.body.totalprice,
            rating: req.body.rating
        });
        const createdProduct = yield product.save();
        res.status(201).json(createdProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.createProduct = createProduct;
// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, title, description, category, type, sizes, size, images, stock, price, prevprice, qty, discount, totalprice, rating } = req.body;
        const product = yield product_model_1.Product.findById(req.params.id);
        if (product) {
            if (id !== undefined)
                product.id = id;
            product.title = title || product.title;
            product.description = description || product.description;
            product.category = category || product.category;
            product.type = type || product.type;
            product.sizes = sizes || product.sizes;
            product.size = size || product.size;
            product.images = images || product.images;
            if (stock !== undefined)
                product.stock = stock;
            if (price !== undefined)
                product.price = price;
            if (prevprice !== undefined)
                product.prevprice = prevprice;
            if (qty !== undefined)
                product.qty = qty;
            if (discount !== undefined)
                product.discount = discount;
            if (totalprice !== undefined)
                product.totalprice = totalprice;
            if (rating !== undefined)
                product.rating = rating;
            const updatedProduct = yield product.save();
            res.json(updatedProduct);
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.updateProduct = updateProduct;
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.Product.findById(req.params.id);
        if (product) {
            yield product.deleteOne();
            res.json({ message: 'Product removed' });
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.deleteProduct = deleteProduct;
// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { rating } = req.body;
        const numericRating = Number(rating);
        const product = yield product_model_1.Product.findById(req.params.id);
        if (product) {
            const previousCount = (_b = (_a = product.rating) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
            const previousRate = (_d = (_c = product.rating) === null || _c === void 0 ? void 0 : _c.rate) !== null && _d !== void 0 ? _d : 0;
            const newCount = previousCount + 1;
            const newRate = ((previousRate * previousCount) + numericRating) / newCount;
            product.rating = {
                rate: newRate,
                count: newCount
            };
            yield product.save();
            res.status(201).json({ message: 'Review recorded' });
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.createProductReview = createProductReview;
// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.Product.find({})
            .sort({ 'rating.rate': -1 })
            .limit(3);
        res.json({
            success: true,
            data: products
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});
exports.getTopProducts = getTopProducts;
// @desc    Get products by category
// @route   GET /api/products/category/:categoryName
// @access  Public
const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.Product.find({ category: new RegExp(`^${req.params.categoryName}$`, 'i') })
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            data: products
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});
exports.getProductsByCategory = getProductsByCategory;
// @desc    Get product statistics
// @route   GET /api/products/stats
// @access  Private/Admin
const getProductStats = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield product_model_1.Product.aggregate([
            {
                $addFields: {
                    stockNum: { $toInt: '$stock' }
                }
            },
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },
                    avgRating: { $avg: '$rating.rate' },
                    totalReviews: { $sum: '$rating.count' },
                    lowStock: {
                        $sum: {
                            $cond: [{ $lt: ['$stockNum', 5] }, 1, 0]
                        }
                    },
                    outOfStock: {
                        $sum: {
                            $cond: [{ $eq: ['$stockNum', 0] }, 1, 0]
                        }
                    }
                }
            }
        ]);
        res.json({
            success: true,
            data: stats[0]
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});
exports.getProductStats = getProductStats;
