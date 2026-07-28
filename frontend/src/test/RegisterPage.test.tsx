import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterPage } from "../pages/register/register";

describe("RegisterPage", () => {
  const mockOnGoLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it("renders the registration form with all required fields", () => {
    render(<RegisterPage onGoLogin={mockOnGoLogin} />);

    // "Create Account" appears as both h1 and button
    expect(screen.getAllByText("Create Account").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("name@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("+977")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Min. 8 characters")).toBeInTheDocument();
  });

  it("calls onGoLogin when login link is clicked", () => {
    render(<RegisterPage onGoLogin={mockOnGoLogin} />);

    fireEvent.click(screen.getByText("Log in"));
    expect(mockOnGoLogin).toHaveBeenCalledTimes(1);
  });

  it("toggles password visibility", () => {
    render(<RegisterPage onGoLogin={mockOnGoLogin} />);

    const passwordInput = screen.getByPlaceholderText("Min. 8 characters");
    expect(passwordInput).toHaveAttribute("type", "password");

    // Find the eye toggle span (it's a span with an onClick handler that toggles showPass)
    const eyeToggleSpan = passwordInput.closest("div")?.querySelector("span[style*='cursor: pointer']");
    if (eyeToggleSpan) fireEvent.click(eyeToggleSpan);

    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("shows success and redirects on successful registration", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "User registered successfully" }),
    });

    // Mock alert
    vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<RegisterPage onGoLogin={mockOnGoLogin} />);

    await userEvent.type(screen.getByPlaceholderText("Full Name"), "John Doe");
    await userEvent.type(screen.getByPlaceholderText("name@email.com"), "john@example.com");
    await userEvent.type(screen.getByPlaceholderText("+977"), "977-1234567890");
    await userEvent.type(screen.getByPlaceholderText("Min. 8 characters"), "password123");

    // Find the "Create Account" button specifically (not the h1)
    const createButtons = screen.getAllByText("Create Account");
    const submitBtn = createButtons.find(btn => btn.tagName === "BUTTON") || createButtons[1];
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Account Created Successfully!");
      expect(mockOnGoLogin).toHaveBeenCalledTimes(1);
    });
  });

  it("shows alert on registration failure", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Registration failed" }),
    });

    vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<RegisterPage onGoLogin={mockOnGoLogin} />);

    await userEvent.type(screen.getByPlaceholderText("Full Name"), "John Doe");
    await userEvent.type(screen.getByPlaceholderText("name@email.com"), "john@example.com");
    await userEvent.type(screen.getByPlaceholderText("Min. 8 characters"), "password123");

    // Find the "Create Account" button specifically (not the h1)
    const createButtons = screen.getAllByText("Create Account");
    const submitBtn = createButtons.find(btn => btn.tagName === "BUTTON") || createButtons[1];
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Registration failed");
    });
  });

  it("displays all form labels", () => {
    render(<RegisterPage onGoLogin={mockOnGoLogin} />);

    // "Full Name" and "Password" appear as labels (the label text)
    const fullNameLabels = screen.getAllByText("Full Name");
    expect(fullNameLabels.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Email Address")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Preferred Room Type (BHK)")).toBeInTheDocument();
    expect(screen.getByText("Preferred Kathmandu Valley Location")).toBeInTheDocument();
  });
});