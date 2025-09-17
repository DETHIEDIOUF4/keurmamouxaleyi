import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

declare module 'express' {
  interface Request {
    user?: {
      _id: string;
      name: string;
      email: string;
      role: string;
    };
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = {
          _id: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role
        };
        next();
      } else {
        res.status(401).json({
          success: false,
          message: 'Non autorisé, utilisateur non trouvé'
        });
      }
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Non autorisé, token invalide'
      });
    }
  } else {
    next();
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Non autorisé, accès administrateur requis'
    });
  }
}; 