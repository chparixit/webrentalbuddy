import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../pages/dashboard/dashboard";

// Mock the API modules to prevent actual network calls
vi.mock("../api/bookingApi", () => ({
  getBookings: vi.fn().mockResolvedValue({ data: [] }),
}));

vi.mock("../api/wishlistApi", () => ({
  getWishlist: vi.fn().mockResolvedValue({ data: [] }),
}));

describe("Dashboard", () => {
  const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    preferredLocation: "Kathmandu - Baluwatar",
    token: "mock-token",
    profileImage: "",
  };

  it("renders the dashboard header with user's name", async () => {
    render(
      <Dashboard
        user={mockUser}
        onGoProfileUpdate={vi.fn()}
        onGoPasswordUpdate={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getAllByText(/John/).length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders user name and email in profile section", async () => {
    render(
      <Dashboard
        user={mockUser}
        onGoProfileUpdate={vi.fn()}
        onGoPasswordUpdate={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getAllByText("John Doe").length).toBeGreaterThanOrEqual(1);
    });
    await waitFor(() => {
      expect(screen.getAllByText("john@example.com").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders all four stats cards", async () => {
    render(
      <Dashboard
        user={mockUser}
        onGoProfileUpdate={vi.fn()}
        onGoPasswordUpdate={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Total Bookings")).toBeInTheDocument();
    });
    expect(screen.getByText("Active Bookings")).toBeInTheDocument();
    expect(screen.getByText("Wishlist")).toBeInTheDocument();
    expect(screen.getByText("Profile Views")).toBeInTheDocument();
  });

  it("renders action buttons", async () => {
    const mockProfileUpdate = vi.fn();
    const mockPasswordUpdate = vi.fn();

    render(
      <Dashboard
        user={mockUser}
        onGoProfileUpdate={mockProfileUpdate}
        onGoPasswordUpdate={mockPasswordUpdate}
      />
    );

    await waitFor(() => {
      expect(screen.getAllByText("Edit Profile").length).toBeGreaterThanOrEqual(1);
    });
    expect(screen.getAllByText("Change Password").length).toBeGreaterThanOrEqual(1);
  });

  it("calls onGoProfileUpdate when update profile button is clicked", async () => {
    const mockProfileUpdate = vi.fn();

    render(
      <Dashboard
        user={mockUser}
        onGoProfileUpdate={mockProfileUpdate}
        onGoPasswordUpdate={vi.fn()}
      />
    );

    await waitFor(() => {
      const editButtons = screen.getAllByText("Edit Profile");
      return editButtons.length > 0;
    });
    const editButtons = screen.getAllByText("Edit Profile");
    fireEvent.click(editButtons[1] || editButtons[0]);
    expect(mockProfileUpdate).toHaveBeenCalledTimes(1);
  });

  it("calls onGoPasswordUpdate when change password button is clicked", async () => {
    const mockPasswordUpdate = vi.fn();

    render(
      <Dashboard
        user={mockUser}
        onGoProfileUpdate={vi.fn()}
        onGoPasswordUpdate={mockPasswordUpdate}
      />
    );

    await waitFor(() => {
      const passwordButtons = screen.getAllByText("Change Password");
      return passwordButtons.length > 0;
    });
    const passwordButtons = screen.getAllByText("Change Password");
    fireEvent.click(passwordButtons[passwordButtons.length - 1]);
    expect(mockPasswordUpdate).toHaveBeenCalledTimes(1);
  });

  it("renders account details section", async () => {
    render(
      <Dashboard
        user={mockUser}
        onGoProfileUpdate={vi.fn()}
        onGoPasswordUpdate={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Account Details")).toBeInTheDocument();
    });
    expect(screen.getAllByText("john@example.com").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Kathmandu - Baluwatar").length).toBeGreaterThanOrEqual(1);
  });

  it("shows 'No user data found' when user is null", () => {
    render(
      <Dashboard
        user={null as any}
        onGoProfileUpdate={vi.fn()}
        onGoPasswordUpdate={vi.fn()}
      />
    );

    expect(screen.getByText("No user data found")).toBeInTheDocument();
  });

  it("shows edit profile button in profile section", async () => {
    render(
      <Dashboard
        user={mockUser}
        onGoProfileUpdate={vi.fn()}
        onGoPasswordUpdate={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getAllByText("Edit Profile").length).toBeGreaterThanOrEqual(1);
    });
  });
});