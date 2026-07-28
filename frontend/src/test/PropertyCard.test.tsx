import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PropertyCard } from "../components/PropertyCard";
import type { Property } from "../types/property";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("../api/wishlistApi", () => ({
  addToWishlist: vi.fn(),
  removeFromWishlist: vi.fn(),
}));

vi.mock("../components/Toast", () => ({
  showToast: vi.fn(),
}));

const mockProperty: Property = {
  _id: "123",
  title: "Beautiful Penthouse",
  description: "Stunning views of the Kathmandu Valley",
  propertyType: "penthouse",
  category: "rent",
  location: "Sanepa",
  city: "Lalitpur",
  price: 150000,
  bedrooms: 4,
  bathrooms: 4,
  area: 2500,
  amenities: ["wifi", "parking", "airConditioning"],
  images: ["https://example.com/image.jpg"],
  availability: "available",
  landlord: {
    _id: "landlord1",
    name: "Admin User",
    email: "admin@example.com",
  },
  featured: true,
  status: "available",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

describe("PropertyCard", () => {
  it("renders property title and price", () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText("Beautiful Penthouse")).toBeInTheDocument();
    expect(screen.getByText(/Rs\. 150,000/)).toBeInTheDocument();
  });

  it("renders location correctly", () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/Sanepa/)).toBeInTheDocument();
    expect(screen.getByText(/Lalitpur/)).toBeInTheDocument();
  });

  it("renders bedrooms, bathrooms, and area", () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("2500 sqft")).toBeInTheDocument();
  });

  it("shows available status", () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText("Available")).toBeInTheDocument();
  });

  it("shows booked status for booked properties", () => {
    const bookedProperty = { ...mockProperty, availability: "booked" as const };
    render(<PropertyCard property={bookedProperty} />);
    expect(screen.getByText("Booked")).toBeInTheDocument();
  });

  it("shows unavailable status for unavailable properties", () => {
    const unavailableProperty = { ...mockProperty, availability: "unavailable" as const };
    render(<PropertyCard property={unavailableProperty} />);
    expect(screen.getByText("Unavailable")).toBeInTheDocument();
  });

  it("renders the monthly price suffix for rent", () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText("/month")).toBeInTheDocument();
  });

  it("does not render monthly suffix for sale", () => {
    const saleProperty = { ...mockProperty, category: "sale" as const };
    render(<PropertyCard property={saleProperty} />);
    expect(screen.queryByText("/month")).not.toBeInTheDocument();
  });

  it("shows featured badge", () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/Featured/)).toBeInTheDocument();
  });

  it("shows new badge for recent properties", () => {
    const recentProperty = {
      ...mockProperty,
      createdAt: new Date().toISOString(),
    };
    render(<PropertyCard property={recentProperty} />);
    expect(screen.getByText("New")).toBeInTheDocument();
  });
});