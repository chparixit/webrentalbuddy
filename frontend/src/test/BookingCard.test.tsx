import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BookingCard } from "../components/BookingCard";
import type { Booking } from "../types/Booking";

const mockBooking: Booking = {
  _id: "booking1",
  property: {
    _id: "prop1",
    title: "Nice Cozy Studio",
    description: "Cozy studio in Kathmandu",
    propertyType: "studio",
    category: "rent",
    location: "Basantapur",
    city: "Kathmandu",
    price: 3000,
    bedrooms: 1,
    bathrooms: 1,
    area: 400,
    amenities: ["WiFi"],
    images: ["https://example.com/img.jpg"],
    availability: "available",
    landlord: { _id: "l1", name: "Admin", email: "admin@test.com" },
    featured: false,
    status: "available",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  user: {
    _id: "user1",
    name: "Tenant",
    email: "tenant@test.com",
    role: "user",
  },
  startDate: "2026-08-01T00:00:00Z",
  endDate: "2026-08-05T00:00:00Z",
  status: "pending",
  totalPrice: 12000,
  guests: 2,
  message: "Looking forward to staying!",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

describe("BookingCard", () => {
  it("renders property title and booking details", () => {
    render(<BookingCard booking={mockBooking} />);

    expect(screen.getByText("Nice Cozy Studio")).toBeInTheDocument();
    expect(screen.getByText(/NPR 12,000/)).toBeInTheDocument();
    expect(screen.getByText(/Basantapur/)).toBeInTheDocument();
    expect(screen.getByText(/Kathmandu/)).toBeInTheDocument();
  });

  it("shows pending status badge", () => {
    render(<BookingCard booking={mockBooking} />);

    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("shows confirmed status badge for confirmed bookings", () => {
    const confirmedBooking = { ...mockBooking, status: "confirmed" as const };
    render(<BookingCard booking={confirmedBooking} />);

    expect(screen.getByText("Confirmed")).toBeInTheDocument();
  });

  it("shows cancelled status badge for cancelled bookings", () => {
    const cancelledBooking = { ...mockBooking, status: "cancelled" as const };
    render(<BookingCard booking={cancelledBooking} />);

    expect(screen.getByText("Cancelled")).toBeInTheDocument();
  });

  it("shows completed status badge for completed bookings", () => {
    const completedBooking = { ...mockBooking, status: "completed" as const };
    render(<BookingCard booking={completedBooking} />);

    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("renders check-in and check-out dates", () => {
    render(<BookingCard booking={mockBooking} />);

    expect(screen.getByText("Check In")).toBeInTheDocument();
    expect(screen.getByText("Check Out")).toBeInTheDocument();
    expect(screen.getByText("Total Price")).toBeInTheDocument();
  });

  it("shows cancel booking button for pending bookings when onCancel is provided", () => {
    const mockCancel = vi.fn();
    render(<BookingCard booking={mockBooking} onCancel={mockCancel} />);

    const cancelBtn = screen.getByText("Cancel Booking");
    expect(cancelBtn).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", () => {
    const mockCancel = vi.fn();
    render(<BookingCard booking={mockBooking} onCancel={mockCancel} />);

    fireEvent.click(screen.getByText("Cancel Booking"));
    expect(mockCancel).toHaveBeenCalledWith("booking1");
  });

  it("does not show cancel button for confirmed bookings", () => {
    const confirmedBooking = { ...mockBooking, status: "confirmed" as const };
    render(<BookingCard booking={confirmedBooking} onCancel={vi.fn()} />);

    expect(screen.queryByText("Cancel Booking")).not.toBeInTheDocument();
  });

  it("renders the guest message when provided", () => {
    render(<BookingCard booking={mockBooking} />);

    expect(screen.getByText(/Looking forward to staying/)).toBeInTheDocument();
  });

  it("calls onViewProperty when clicking the property title", () => {
    const mockView = vi.fn();
    render(<BookingCard booking={mockBooking} onViewProperty={mockView} />);

    fireEvent.click(screen.getByText("Nice Cozy Studio"));
    expect(mockView).toHaveBeenCalledWith("prop1");
  });
});