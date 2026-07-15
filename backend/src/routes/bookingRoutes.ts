// === Booking Routes ===
// All booking routes require JWT authentication
// Admin has elevated privileges (view all, delete any)
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate, createBookingValidation } from "../middlewares/validate";
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controller/bookingController";

const router = express.Router();

// All booking routes require authentication
router.use(authMiddleware);

router.get("/", getBookings);
router.get("/:id", getBookingById);
router.post("/", validate(createBookingValidation), createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;