// === Booking Controller ===
// Handles HTTP requests for booking CRUD operations
import { Request, Response } from "express";
import mongoose from "mongoose";
import * as bookingService from "../services/booking.service";

type AuthenticatedRequest = Request & { user?: any };

/**
 * GET /api/v1/bookings
 * Get all bookings (admin sees all, users see only their own)
 */
export const getBookings = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user._id;
    const isAdmin = authReq.user.role === "admin";

    const result = await bookingService.getBookings(userId, isAdmin);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * GET /api/v1/bookings/:id
 * Get a single booking by ID
 */
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user._id;
    const isAdmin = authReq.user.role === "admin";
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await bookingService.getBookingById(id, userId, isAdmin);
    return res.status(200).json({ data: booking });
  } catch (error: any) {
    if (error.message === "Booking not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Not authorized to view this booking") {
      return res.status(403).json({ message: error.message });
    }
    console.error("Error fetching booking:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * POST /api/v1/bookings
 * Create a new booking
 */
export const createBooking = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user._id;

    const { property, startDate, endDate, guests, message } = req.body;

    // Validate required fields
    if (!property || !startDate || !endDate) {
      return res.status(400).json({
        message: "Required fields: property, startDate, endDate",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(property)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const result = await bookingService.createBooking(
      { property, startDate, endDate, guests, message },
      userId
    );

    return res.status(201).json(result);
  } catch (error: any) {
    if (error.message === "Property not found") {
      return res.status(404).json({ message: error.message });
    }
    if (
      error.message === "Check-in date must be before check-out date" ||
      error.message === "Check-in date cannot be in the past" ||
      error.message === "Property is already booked for the selected dates" ||
      error.message === "Property is not available for booking"
    ) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error creating booking:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * PUT /api/v1/bookings/:id
 * Update a booking (e.g., cancel or change status)
 */
export const updateBooking = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user._id;
    const isAdmin = authReq.user.role === "admin";
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const { status, guests } = req.body;

    const result = await bookingService.updateBooking(
      id,
      { status, guests },
      userId,
      isAdmin
    );

    return res.status(200).json(result);
  } catch (error: any) {
    if (error.message === "Booking not found") {
      return res.status(404).json({ message: error.message });
    }
    if (
      error.message === "Not authorized to update this booking"
    ) {
      return res.status(403).json({ message: error.message });
    }
    console.error("Error updating booking:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * DELETE /api/v1/bookings/:id
 * Delete a booking (admin only)
 */
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;

    // Check admin permission
    if (authReq.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const result = await bookingService.deleteBooking(id);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.message === "Booking not found") {
      return res.status(404).json({ message: error.message });
    }
    console.error("Error deleting booking:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};