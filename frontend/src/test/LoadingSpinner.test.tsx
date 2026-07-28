import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "../components/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders spinner SVG", () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders text when provided", () => {
    render(<LoadingSpinner text="Loading data..." />);
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("does not render text when not provided", () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector("span")).not.toBeInTheDocument();
  });

  it("applies custom size", () => {
    const { container } = render(<LoadingSpinner size={60} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("60");
    expect(svg?.getAttribute("height")).toBe("60");
  });

  it("has spinning animation style", () => {
    const { container } = render(<LoadingSpinner />);
    const svg = container.querySelector("svg");
    expect(svg?.style.animation).toContain("spin");
  });
});