// === Booking Service ===
// Handles all business logic for booking CRUD and validation
import Booking from "../models/Booking";
import Property from "../models/Property";

interface CreateBookingData {
  property: string;
  startDate: string;
  endDate: string;
  guests?: number;
  message?: string;
}

/**
 * Get all bookings for a user (or all bookings for admin)
 */
export const getBookings = async (userId: string, isAdmin: boolean) => {
  let filter: any = {};

  if (!isAdmin) {
    // Regular users can only see their own bookings
    filter.user = userId;
  }

  const bookings = await Booking.find(filter)
    .populate({
      path: "property",
      populate: { path: "landlord", select: "name email profileImage" },
    })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  return { data: bookings };
};

/**
 * Get a single booking by ID
 */
export const getBookingById = async (id: string, userId: string, isAdmin: boolean) => {
  const booking = await Booking.findById(id)
    .populate({
      path: "property",
      populate: { path: "landlord", select: "name email profileImage" },
    })
    .populate("user", "name email");

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Regular users can only view their own bookings
  const bookingUserId = typeof booking.user === 'object' && booking.user._id
    ? booking.user._id.toString()
    : booking.user.toString();
  const userIdStr = String(userId);
  if (!isAdmin && bookingUserId !== userIdStr) {
    throw new Error("Not authorized to view this booking");
  }

  return booking;
};

/**
 * Create a new booking
 */
export const createBooking = async (data: CreateBookingData, userId: string) => {
  const { property: propertyId, startDate, endDate, guests } = data;

  // Validate property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new Error("Property not found");
  }

  // Check if property is available
  if (property.status !== "available") {
    throw new Error("Property is not available for booking");
  }

  // Parse dates
  const checkIn = new Date(startDate);
  const checkOut = new Date(endDate);

  // Validate check-in is before check-out
  if (checkIn >= checkOut) {
    throw new Error("Check-in date must be before check-out date");
  }

  // Validate check-in is not in the past
  if (checkIn < new Date(new Date().setHours(0, 0, 0, 0))) {
    throw new Error("Check-in date cannot be in the past");
  }

  // Prevent duplicate overlapping bookings for the same property
  const overlapping = await Booking.findOne({
    property: propertyId,
    status: { $in: ["pending", "confirmed"] },
    $or: [
      { startDate: { $lt: checkOut, $gte: checkIn } },
      { endDate: { $gt: checkIn, $lte: checkOut } },
      { startDate: { $lte: checkIn }, endDate: { $gte: checkOut } },
    ],
  });

  if (overlapping) {
    throw new Error("Property is already booked for the selected dates");
  }

  // Calculate total price: number of nights * price per night
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = nights * property.price;

  const booking = await Booking.create({
    user: userId,
    property: propertyId,
    startDate: checkIn,
    endDate: checkOut,
    guests: guests || 1,
    message: data.message || "",
    totalPrice,
  });

  // Populate before returning
  const populated = await Booking.findById(booking._id)
    .populate({
      path: "property",
      populate: { path: "landlord", select: "name email profileImage" },
    })
    .populate("user", "name email");

  return { data: populated };
};

/**
 * Update a booking (e.g., change status)
 */
export const updateBooking = async (id: string, data: { status?: string; guests?: number }, userId: string, isAdmin: boolean) => {
  const booking = await Booking.findById(id);
  if (!booking) {
    throw new Error("Booking not found");
  }

  // Regular users can only update their own bookings
  const bookingUserId = typeof booking.user === 'object' && booking.user._id
    ? booking.user._id.toString()
    : booking.user.toString();
  const userIdStr = String(userId);
  if (!isAdmin && bookingUserId !== userIdStr) {
    throw new Error("Not authorized to update this booking");
  }

  // Regular users can only cancel their own bookings
  if (!isAdmin && data.status && data.status === "cancelled") {
    // Allow users to cancel their own bookings
    booking.status = "cancelled";
    await booking.save();
  } else if (isAdmin) {
    // Admin can change status to anything
    if (data.status) {
      booking.status = data.status as any;
    }
    if (data.guests) {
      booking.guests = data.guests;
    }
    await booking.save();
  } else {
    throw new Error("Not authorized to update this booking");
  }

  const populated = await Booking.findById(booking._id)
    .populate({
      path: "property",
      populate: { path: "landlord", select: "name email profileImage" },
    })
    .populate("user", "name email");

  return { data: populated };
};

/**
 * Delete a booking (admin only)
 */
export const deleteBooking = async (id: string) => {
  const booking = await Booking.findByIdAndDelete(id);

  if (!booking) {
    throw new Error("Booking not found");
  }

  return { message: "Booking deleted successfully" };
};