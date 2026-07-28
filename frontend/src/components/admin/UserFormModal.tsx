// === UserFormModal Component ===
// Modal form for creating or editing a user with validation
import { useState, useEffect } from "react";
import type { UserData } from "../../types/user";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; password?: string; role: string; status: string }) => Promise<void>;
  user?: UserData | null; // if provided, we're editing; otherwise creating
}

export const UserFormModal = ({ isOpen, onClose, onSubmit, user }: UserFormModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Prefill form when editing
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword("");
      setRole(user.role);
      setStatus(user.status || "active");
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      setStatus("active");
    }
    setError(null);
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
  }, [user, isOpen]);

  const validate = (): boolean => {
    let valid = true;

    // Name validation
    if (!name.trim()) {
      setNameError("Name is required");
      valid = false;
    } else {
      setNameError(null);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      valid = false;
    } else {
      setEmailError(null);
    }

    // Password validation: required when creating, optional when editing
    if (!user && !password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password && password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    } else {
      setPasswordError(null);
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      const payload: { name: string; email: string; password?: string; role: string; status: string } = {
        name: name.trim(),
        email: email.trim(),
        role,
        status,
      };
      // Only include password if it was provided (for edits, it's optional)
      if (password) {
        payload.password = password;
      }
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 32,
          width: "90%",
          maxWidth: 480,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700 }}>
          {user ? "Edit User" : "Create User"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 6 }}>
              Name *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: `1.5px solid ${nameError ? "#DC2626" : "#E5E7EB"}`,
                borderRadius: 10,
                fontSize: 14,
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
            {nameError && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#DC2626" }}>{nameError}</p>}
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 6 }}>
              Email *
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: `1.5px solid ${emailError ? "#DC2626" : "#E5E7EB"}`,
                borderRadius: 10,
                fontSize: 14,
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
            {emailError && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#DC2626" }}>{emailError}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 6 }}>
              Password {user ? "(leave blank to keep current)" : "*"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: `1.5px solid ${passwordError ? "#DC2626" : "#E5E7EB"}`,
                borderRadius: 10,
                fontSize: 14,
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
            {passwordError && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#DC2626" }}>{passwordError}</p>}
          </div>

          {/* Role */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 6 }}>
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "user")}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1.5px solid #E5E7EB",
                borderRadius: 10,
                fontSize: 14,
                outline: "none",
                fontFamily: "inherit",
                background: "white",
                boxSizing: "border-box",
              }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 6 }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1.5px solid #E5E7EB",
                borderRadius: 10,
                fontSize: 14,
                outline: "none",
                fontFamily: "inherit",
                background: "white",
                boxSizing: "border-box",
              }}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Error message */}
          {error && (
            <p style={{ color: "#DC2626", fontSize: 13, marginBottom: 16, textAlign: "center" }}>{error}</p>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 24px",
                background: "white",
                border: "1.5px solid #E5E7EB",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 24px",
                background: loading ? "#9CA3AF" : "#2563EB",
                color: "white",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {loading ? "Saving..." : user ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};