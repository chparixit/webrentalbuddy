import React, { useState } from "react";

interface PasswordUpdateFormProps {
  user: any;
  onBack?: () => void;
}

const PasswordUpdateForm = ({ user, onBack: _onBack }: PasswordUpdateFormProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (user?.token || ""),
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Password update failed");
      }

      setMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ off = false }: { off?: boolean }) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6B7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {off ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Password update form"
      style={{
        background: "white",
        borderRadius: 16,
        padding: 32,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <label
          htmlFor="current-password"
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: "#6B7280",
            marginBottom: 6,
          }}
        >
          Current Password
        </label>
        <div style={{ position: "relative" }}>
          <input
            id="current-password"
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            aria-label="Current password"
            autoComplete="current-password"
            style={{
              width: "100%",
              padding: "12px 14px",
              paddingRight: 44,
              border: "1.5px solid #E5E7EB",
              borderRadius: 10,
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            aria-label={showCurrent ? "Hide current password" : "Show current password"}
            aria-pressed={showCurrent}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
            }}
          >
            <EyeIcon off={!showCurrent} />
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label
          htmlFor="new-password"
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: "#6B7280",
            marginBottom: 6,
          }}
        >
          New Password
        </label>
        <div style={{ position: "relative" }}>
          <input
            id="new-password"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            aria-label="New password"
            autoComplete="new-password"
            style={{
              width: "100%",
              padding: "12px 14px",
              paddingRight: 44,
              border: "1.5px solid #E5E7EB",
              borderRadius: 10,
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            aria-label={showNew ? "Hide new password" : "Show new password"}
            aria-pressed={showNew}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
            }}
          >
            <EyeIcon off={!showNew} />
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label
          htmlFor="confirm-password"
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: "#6B7280",
            marginBottom: 6,
          }}
        >
          Confirm New Password
        </label>
        <div style={{ position: "relative" }}>
          <input
            id="confirm-password"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-label="Confirm new password"
            autoComplete="new-password"
            style={{
              width: "100%",
              padding: "12px 14px",
              paddingRight: 44,
              border: "1.5px solid #E5E7EB",
              borderRadius: 10,
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            aria-pressed={showConfirm}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
            }}
          >
            <EyeIcon off={!showConfirm} />
          </button>
        </div>
      </div>

      {message && (
        <p
          role="alert"
          style={{
            color: message.includes("success") ? "#059669" : "#DC2626",
            fontSize: 13,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        aria-label={loading ? "Updating password" : "Update password"}
        style={{
          width: "100%",
          padding: "14px",
          background: loading ? "#9CA3AF" : "#2563EB",
          color: "white",
          border: "none",
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit",
        }}
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};

export { PasswordUpdateForm };
export default PasswordUpdateForm;
