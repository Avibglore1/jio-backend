import express from 'express';
import { 
  addToWishlist, 
  removeFromWishlist, 
  getWishlist 
} from '../controllers/wishlist.js'; // Adjust import path
import { verifyToken } from '../middleware/authMiddleware.js'; // You'll need to create this middleware

const router = express.Router();

// Add item to wishlist
router.post('/add', verifyToken, addToWishlist);

// Remove item from wishlist
router.delete('/remove/:id', verifyToken, removeFromWishlist);

// Get user's wishlist
router.get('/', verifyToken, getWishlist);

export default router;