import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginPage } from "../pages/Login/login";

describe("LoginPage", () => {
  const mockOnGoRegister = vi.fn();
  const mockOnLoginSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the login form with all required fields", () => {
    render(
      <LoginPage onGoRegister={mockOnGoRegister} onLoginSuccess={mockOnLoginSuccess} />
    );

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("name@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByText("Login →")).toBeInTheDocument();
  });

  it("shows error when submitting with empty fields", async () => {
    render(
      <LoginPage onGoRegister={mockOnGoRegister} onLoginSuccess={mockOnLoginSuccess} />
    );

    fireEvent.click(screen.getByText("Login →"));

    await waitFor(() => {
      expect(screen.getByText("Please enter email and password")).toBeInTheDocument();
    });
  });

  it("calls onGoRegister when create account link is clicked", () => {
    render(
      <LoginPage onGoRegister={mockOnGoRegister} onLoginSuccess={mockOnLoginSuccess} />
    );

    fireEvent.click(screen.getByText("Create an account"));
    expect(mockOnGoRegister).toHaveBeenCalledTimes(1);
  });

  it("shows error message from failed login attempt", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid email or password" }),
    });

    render(
      <LoginPage onGoRegister={mockOnGoRegister} onLoginSuccess={mockOnLoginSuccess} />
    );

    const emailInput = screen.getByPlaceholderText("name@example.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    fireEvent.click(screen.getByText("Login →"));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
  });

  it("disables button during loading state", async () => {
    globalThis.fetch = vi.fn().mockReturnValue(new Promise(() => {}));

    render(
      <LoginPage onGoRegister={mockOnGoRegister} onLoginSuccess={mockOnLoginSuccess} />
    );

    const emailInput = screen.getByPlaceholderText("name@example.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    fireEvent.click(screen.getByText("Login →"));

    await waitFor(() => {
      expect(screen.getByText("Signing in...")).toBeInTheDocument();
    });
  });

  it("displays the email and password labels", () => {
    render(
      <LoginPage onGoRegister={mockOnGoRegister} onLoginSuccess={mockOnLoginSuccess} />
    );

    expect(screen.getByText("Email Address")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
  });
});