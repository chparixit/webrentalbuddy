import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WishlistButton } from "../components/WishlistButton";

vi.mock("../api/wishlistApi", () => ({
  addToWishlist: vi.fn().mockResolvedValue({ data: { _id: "wish1" } }),
  removeFromWishlist: vi.fn().mockResolvedValue({}),
}));

vi.mock("../components/Toast", () => ({
  showToast: vi.fn(),
}));

describe("WishlistButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with correct aria-label when not wishlisted", () => {
    render(<WishlistButton propertyId="prop1" />);
    expect(
      screen.getByLabelText("Add to wishlist")
    ).toBeInTheDocument();
  });

  it("renders with correct aria-label when wishlisted", () => {
    render(<WishlistButton propertyId="prop1" initialWishlisted={true} />);
    expect(
      screen.getByLabelText("Remove from wishlist")
    ).toBeInTheDocument();
  });

  it("has correct position style", () => {
    render(<WishlistButton propertyId="prop1" />);
    const btn = screen.getByLabelText("Add to wishlist");
    expect(btn.style.position).toBe("absolute");
    expect(btn.style.zIndex).toBe("3");
  });

  it("renders an SVG icon inside", () => {
    render(<WishlistButton propertyId="prop1" />);
    const btn = screen.getByLabelText("Add to wishlist");
    expect(btn.querySelector("svg")).toBeInTheDocument();
  });
});