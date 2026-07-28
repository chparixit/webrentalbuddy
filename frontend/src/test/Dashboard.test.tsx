import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "../pages/dashboard/dashboard";

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

  it("renders the dashboard header with user's name", () => {
    render(
      <Dashboard
        user={mockUser}
        onGoProfileUpdate={vi.fn()}
        onGoPasswordUpdate={vi.fn()}
      />
    );

    expect(screen.getAllByText(/John/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders user name and email in profile section", () => {
    render(
      <Dashboard
        user={mockUser}
        onGoProfileUpdate={vi.fn()}
        onGoPasswordUpdate={vi.fn()}
      />
    );

    expect(screen.getAllByText("John Doe").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("john@example.com").length).toBeGreaterThanOrEqual(1);
  });

  it("renders all four stats cards", () => {
    render(
      <Dashboard
        user={mockUser}
        onGoProfileUpdate={vi.fn()}
        onGoPasswordUpdate={vi.fn()}
      />
    );

    expect(screen.getByText("Total Bookings")).toBeInTheDocument();
    expect(screen.getByText("Active Bookings")).toBeInTheDocument();
    expect(screen.getByText("Wishlist")).toBeInTheDocument();
    expect(screen.getByText("Profile Views")).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    const mockProfileUpdate = vi.fn();
    const mockPasswordUpdate = vi.fn();

    render(
      <Dashboard
        user={mockUser}
        onGoProfileUpdate={mockProfileUpdate}
        onGoPasswordUpdate={mockPasswordUpdate}
      />
    );

    expect(screen.getAllByText("Edit Profile").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Change Password").length).toBeGreaterThanOrEqual(1);
  });

  it("calls onGoProfileUpdate when update profile button is clicked", () => {
    const mockProfileUpdate = vi.fn();

    render(
      <Dashboard
        user={mockUser}
        onGoProfileUpdate={mockProfileUpdate}
        onGoPasswordUpdate={vi.fn()}
      />
    );

    const editButtons = screen.getAllByText("Edit Profile");
    fireEvent.click(editButtons[1] || editButtons[0]);
    expect(mockProfileUpdate).toHaveBeenCalledTimes(1);
  });

  it("calls onGoPasswordUpdate when change password button is clicked", () => {
    const mockPasswordUpdate = vi.fn();

    render(
      <Dashboard
        user={mockUser}
        onGoProfileUpdate={vi.fn()}
        onGoPasswordUpdate={mockPasswordUpdate}
      />
    );

    const passwordButtons = screen.getAllByText("Change Password");
    fireEvent.click(passwordButtons[passwordButtons.length - 1]);
    expect(mockPasswordUpdate).toHaveBeenCalledTimes(1);
  });

  it("renders account details section", () => {
    render(
      <Dashboard
        user={mockUser}
        onGoProfileUpdate={vi.fn()}
        onGoPasswordUpdate={vi.fn()}
      />
    );

    expect(screen.getByText("Account Details")).toBeInTheDocument();
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

  it("shows edit profile button in profile section", () => {
    render(
      <Dashboard
        user={mockUser}
        onGoProfileUpdate={vi.fn()}
        onGoPasswordUpdate={vi.fn()}
      />
    );

    expect(screen.getAllByText("Edit Profile").length).toBeGreaterThanOrEqual(1);
  });
});