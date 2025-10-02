import {User} from "./../Model/UserModel.js";

export const addToWishlist = async (req, res) => {
  try {
    const { poster_path, name, id } = req.body;

    // Find the user by ID
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the movie already exists in the wishlist
    const isItemExists = user.wishlist.some((item) => item.id === id);

    if (isItemExists) {
      return res.status(400).json({ success: false, message: "Movie already in watchlist" });
    }

    // Add movie to wishlist
    user.wishlist.push({ poster_path, name, id });
    await user.save();

    // Remove duplicates after adding the new item
    user.wishlist = Array.from(
      new Map(user.wishlist.map(item => [item.id, item])).values()
    );
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Movie added to watchlist", 
      wishlist: user.wishlist 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error adding movie to watchlist", 
      error: error.message 
    });
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(req.user.id);
    
    // Convert id to number for strict comparison
    const movieId = parseInt(id);
    
    user.wishlist = user.wishlist.filter(item => item.id !== movieId);
    
    await user.save();

    res.status(200).json({
      success: true,
      message: "Movie removed from watchlist",
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing movie from watchlist",
      error: error.message
    });
  }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching watchlist",
      error: error.message
    });
  }
};
