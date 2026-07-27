// === Wishlist Routes ===
// All wishlist routes require JWT authentication
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
} from "../controller/wishlistController";

const router = express.Router();

// All wishlist routes require authentication
router.use(authMiddleware);

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.get("/check/:propertyId", checkWishlistStatus);
router.delete("/:propertyId", removeFromWishlist);

export default router;