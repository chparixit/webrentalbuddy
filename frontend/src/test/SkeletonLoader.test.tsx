import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SkeletonLoader } from "../components/SkeletonLoader";

describe("SkeletonLoader", () => {
  it("renders skeleton cards for card type", () => {
    const { container } = render(<SkeletonLoader count={3} type="card" />);
    // Card type renders skeleton divs with shimmer animation
    const shimmerDivs = container.querySelectorAll('[style*="shimmer"]');
    expect(shimmerDivs.length).toBeGreaterThan(0);
  });

  it("renders skeleton detail for detail type", () => {
    const { container } = render(<SkeletonLoader type="detail" />);
    const shimmerDivs = container.querySelectorAll('[style*="shimmer"]');
    expect(shimmerDivs.length).toBeGreaterThan(0);
  });

  it("renders skeleton text for text type", () => {
    const { container } = render(<SkeletonLoader type="text" />);
    const shimmerDivs = container.querySelectorAll('[style*="shimmer"]');
    expect(shimmerDivs.length).toBeGreaterThan(0);
  });

  it("renders grid layout for card type", () => {
    const { container } = render(<SkeletonLoader type="card" />);
    const grid = container.firstChild as HTMLElement;
    expect(grid).toBeTruthy();
  });
});