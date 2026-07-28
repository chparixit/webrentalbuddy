import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useProfile } from "../hooks/useProfile";

const mockUser = {
  id: "user-1",
  name: "Jane Doe",
  email: "jane@example.com",
  token: "test-token",
  profileImage: "",
};

const mockSetUser = vi.fn();

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
    setUser: mockSetUser,
  }),
}));

vi.mock("../components/Toast", () => ({
  showToast: vi.fn(),
}));

describe("useProfile", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockSetUser.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("stops loading and falls back to auth user data when the profile request hangs", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string, init?: RequestInit) =>
        new Promise<Response>((_, reject) => {
          const signal = init?.signal;
          if (signal) {
            signal.addEventListener("abort", () => {
              reject(new DOMException("The operation was aborted.", "AbortError"));
            });
          }
        })
      )
    );

    const { result } = renderHook(() => useProfile());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(8000);
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.profile.name).toBe("Jane Doe");
    expect(result.current.profile.email).toBe("jane@example.com");
  });
});
