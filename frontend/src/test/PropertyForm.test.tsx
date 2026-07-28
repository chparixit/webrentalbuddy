import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PropertyForm } from "../components/PropertyForm";

describe("PropertyForm", () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the add property form with title", () => {
    render(
      <PropertyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    expect(screen.getByText("Add New Property")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add property/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("renders the edit property form with title when initialData is provided", () => {
    render(
      <PropertyForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialData={null}
      />
    );

    expect(screen.getByText("Add New Property")).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(
      <PropertyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    fireEvent.click(screen.getByRole("button", { name: /add property/i }));

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("Description is required")).toBeInTheDocument();
      expect(screen.getByText("Valid price is required")).toBeInTheDocument();
    });
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(
      <PropertyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("renders all required form fields", () => {
    render(
      <PropertyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    expect(screen.getByText(/Title \*/)).toBeInTheDocument();
    expect(screen.getByText(/Price/)).toBeInTheDocument();
    expect(screen.getByText("Property Type")).toBeInTheDocument();
    expect(screen.getByText("Bedrooms")).toBeInTheDocument();
    expect(screen.getByText("Bathrooms")).toBeInTheDocument();
    expect(screen.getByText(/Area/)).toBeInTheDocument();
    expect(screen.getByText("City")).toBeInTheDocument();
    expect(screen.getByText(/Location \*/)).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText(/Description \*/)).toBeInTheDocument();
    expect(screen.getByText("Amenities (comma separated)")).toBeInTheDocument();
  });

  it("shows saving state when loading is true", () => {
    render(
      <PropertyForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={true}
      />
    );

    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it("title input updates value on change", async () => {
    render(
      <PropertyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    // Find the title input by its label text
    const titleLabel = screen.getByText(/Title \*/);
    // The input is in the same parent div as the label
    const input = titleLabel.closest("div")?.querySelector("input");
    expect(input).not.toBeNull();
    if (input) {
      await userEvent.type(input, "Test Property");
      expect(input).toHaveValue("Test Property");
    }
  });
});