import { Request, Response } from 'express';
import { Product, IProduct } from '../models/product.model';
import { protect, admin } from '../middleware/auth';
import mongoose from 'mongoose';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product({
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

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const {
      id,
      title,
      description,
      category,
      type,
      sizes,
      size,
      images,
      stock,
      price,
      prevprice,
      qty,
      discount,
      totalprice,
      rating
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      if (id !== undefined) product.id = id;
      product.title = title || product.title;
      product.description = description || product.description;
      product.category = category || product.category;
      product.type = type || product.type;
      product.sizes = sizes || product.sizes;
      product.size = size || product.size;
      product.images = images || product.images;
      if (stock !== undefined) product.stock = stock;
      if (price !== undefined) product.price = price;
      if (prevprice !== undefined) product.prevprice = prevprice;
      if (qty !== undefined) product.qty = qty;
      if (discount !== undefined) product.discount = discount;
      if (totalprice !== undefined) product.totalprice = totalprice;
      if (rating !== undefined) product.rating = rating;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req: Request, res: Response) => {
  try {
    const { rating } = req.body;
    const numericRating = Number(rating);

    const product = await Product.findById(req.params.id);

    if (product) {
      const previousCount = product.rating?.count ?? 0;
      const previousRate = product.rating?.rate ?? 0;
      const newCount = previousCount + 1;
      const newRate = ((previousRate * previousCount) + numericRating) / newCount;

      product.rating = {
        rate: newRate,
        count: newCount
      } as IProduct['rating'];

      await product.save();
      res.status(201).json({ message: 'Review recorded' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find({})
      .sort({ 'rating.rate': -1 })
      .limit(3);

    res.json({
      success: true,
      data: products
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categoryName
// @access  Public
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ category: new RegExp(`^${req.params.categoryName}$`, 'i') })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get product statistics
// @route   GET /api/products/stats
// @access  Private/Admin
export const getProductStats = async (_req: Request, res: Response) => {
  try {
    const stats = await Product.aggregate([
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 