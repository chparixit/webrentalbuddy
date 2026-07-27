import User from "../models/User";
import Property from "../models/Property";
import Booking from "../models/Booking";

export const getAdminStats = async () => {
  const [
    totalUsers,
    totalProperties,
    totalBookings,
    activeBookings,
    pendingBookings,
    completedBookings,
    cancelledBookings,
    propertiesByType,
    propertiesByCity,
    recentBookings,
    totalRevenueResult,
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Property.countDocuments(),
    Booking.countDocuments(),
    Booking.countDocuments({ status: "confirmed" }),
    Booking.countDocuments({ status: "pending" }),
    Booking.countDocuments({ status: "completed" }),
    Booking.countDocuments({ status: "cancelled" }),
    Property.aggregate([
      { $group: { _id: "$propertyType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Property.aggregate([
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("property", "title location city images price")
      .populate("user", "name email")
      .lean(),
    Booking.aggregate([
      { $match: { status: { $in: ["confirmed", "completed"] } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),
  ]);

  const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

  const totalPropertyTypes = propertiesByType.reduce((sum, p) => sum + p.count, 0);
  const categories = propertiesByType.map((p) => ({
    label: p._id ? p._id.charAt(0).toUpperCase() + p._id.slice(1) : "Unknown",
    count: p.count,
    percentage: totalPropertyTypes > 0 ? Math.round((p.count / totalPropertyTypes) * 100) : 0,
  }));

  return {
    totalUsers,
    totalProperties,
    totalBookings,
    totalRevenue,
    activeBookings,
    pendingBookings,
    completedBookings,
    cancelledBookings,
    categories,
    propertiesByCity,
    recentBookings,
  };
};
