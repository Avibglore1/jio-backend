import express from 'express';
import { 
  addToWishlist, 
  removeFromWishlist, 
  getWishlist 
} from '../controllers/wishlist.js'; // Adjust import path
import { verifyToken } from '../middleware/authMiddleware.js'; // You'll need to create this middleware

export const UserRouter = express.Router();

// Add item to wishlist
UserRouter.post('/add', verifyToken, addToWishlist);

// Remove item from wishlist
UserRouter.delete('/remove/:id', verifyToken, removeFromWishlist);

// Get user's wishlist
UserRouter.get('/', verifyToken, getWishlist);

