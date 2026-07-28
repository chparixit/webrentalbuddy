import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyState } from "../components/EmptyState";

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<EmptyState title="Empty" description="No items found" />);
    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(<EmptyState title="Empty" />);
    expect(screen.queryByText("No items found")).not.toBeInTheDocument();
  });

  it("renders action button when action is provided", () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        title="Empty"
        action={{ label: "Add Item", onClick }}
      />
    );
    const btn = screen.getByText("Add Item");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not render action button when action is not provided", () => {
    render(<EmptyState title="Empty" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders custom icon when provided", () => {
    render(
      <EmptyState
        title="Empty"
        icon={<span data-testid="custom-icon">🔍</span>}
      />
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });
});