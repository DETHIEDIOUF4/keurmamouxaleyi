export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProduct {
  _id?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrder {
  _id?: string;
  user: string | IUser;
  items: Array<{
    product: string | IProduct;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  shippingAddress: {
    address: string;
    city: string;
    district: string;
    instructions?: string;
  };
  deliveryMethod: 'standard' | 'express';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  _id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
} 