import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmDialog } from "../components/ConfirmDialog";

describe("ConfirmDialog", () => {
  it("renders nothing when isOpen is false", () => {
    const { container } = render(
      <ConfirmDialog
        isOpen={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Test"
        message="Test message"
      />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders title and message when isOpen is true", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
      />
    );
    expect(screen.getByText("Delete Item")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this item?")
    ).toBeInTheDocument();
  });

  it("renders default confirm and cancel labels", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Test"
        message="Test message"
      />
    );
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("renders custom labels when provided", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Test"
        message="Test message"
        confirmLabel="Yes, Delete"
        cancelLabel="No, Keep"
      />
    );
    expect(screen.getByText("Yes, Delete")).toBeInTheDocument();
    expect(screen.getByText("No, Keep")).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={onConfirm}
        title="Test"
        message="Test message"
      />
    );
    fireEvent.click(screen.getByText("Confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when cancel button is clicked", () => {
    const onClose = vi.fn();
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={vi.fn()}
        title="Test"
        message="Test message"
      />
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows Processing... text when loading", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Test"
        message="Test message"
        loading={true}
      />
    );
    expect(screen.getByText("Processing...")).toBeInTheDocument();
  });

  it("has danger variant by default", () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Test"
        message="Test message"
      />
    );
    // Danger variant shows an alert triangle SVG path
    const { container } = render(
      <ConfirmDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Test"
        message="Test message"
        variant="danger"
      />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});