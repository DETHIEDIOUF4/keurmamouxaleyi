import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  id?: number;
  title: string;
  description: string;
  category: string;
  type: string;
  sizes?: string[];
  size?: string;
  images: string[];
  stock: string;
  price: number;
  prevprice: number;
  qty?: number;
  discount?: number;
  totalprice?: number;
  rating: {
    rate: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    id: { type: Number, unique: true, sparse: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    sizes: [{ type: String }],
    size: { type: String },
    images: [{ type: String, required: true }],
    stock: { type: String, required: true, default: "0" },
    price: { type: Number, required: true, min: 0 },
    prevprice: { type: Number, required: true, min: 0 },
    qty: { type: Number },
    discount: { type: Number, min: 0 },
    totalprice: { type: Number, min: 0 },
    rating: {
      rate: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 }
    }
  },
  {
    timestamps: true
  }
);

export const Product = mongoose.model<IProduct>('Product', productSchema); 