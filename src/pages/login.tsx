import { useState } from "react";
import { loginApi, type AuthResponse, type AuthUser } from "../api/authApi";

// ─── Icons ────────────────────────────────────────────────────────────────────

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ off = false }: { off?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// ─── Image Panel ──────────────────────────────────────────────────────────────

const ImagePanel = () => (
  <div
    style={{
      width: "50%",
      position: "relative",
      backgroundImage:
        "url('https://images.unsplash.com/photo-1768278929634-4bf4976a0c7c?w=1200&auto=format&fit=crop&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "flex-end",
      minHeight: "100vh",
    }}
  >
    {/* Overlay */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.7) 100%)",
      }}
    />

    {/* Bottom Text */}
    <div
      style={{
        position: "relative",
        zIndex: 2,
        padding: "40px",
        color: "white",
      }}
    >
      <h2
        style={{
          fontSize: "42px",
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: 16,
          fontFamily: "'Georgia', serif",
        }}
      >
        Welcome Home to Excellence
      </h2>

      <p
        style={{
          fontSize: "16px",
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.85)",
          maxWidth: 500,
        }}
      >
        Experience a seamless way to find, rent, and manage properties in the
        heart of Kathmandu.
      </p>
    </div>
  </div>
);

// ─── LoginPage ────────────────────────────────────────────────────────────────

interface LoginPageProps {
  onGoRegister: () => void;
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage = ({ onGoRegister, onLoginSuccess }: LoginPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 80px", background: "#F9FAFB", minHeight: "calc(100vh - 60px - 200px)" }}>
      <div style={{ display: "flex", background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.08)", width: "100%", maxWidth: 900 }}>
        <ImagePanel />

        <div style={{ flex: 1, padding: "52px 48px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827", margin: "0 0 8px", fontFamily: "'Georgia', serif" }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 36px", lineHeight: 1.6 }}>
            Please enter your credentials to access your account.
          </p>

          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>
              Email Address
            </label>
            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #E5E7EB", borderRadius: 10, background: "#FAFAFA", padding: "0 14px", gap: 10 }}>
              <span style={{ color: "#9CA3AF" }}><MailIcon /></span>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ flex: 1, border: "none", background: "transparent", outline: "none", padding: "13px 0", fontSize: 14, color: "#111827", fontFamily: "inherit" }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#6B7280", textTransform: "uppercase" }}>
                Password
              </label>
              <a href="#" style={{ fontSize: 11, fontWeight: 600, color: "#2563EB", textDecoration: "none", letterSpacing: "0.05em" }}>
                FORGOT PASSWORD?
              </a>
            </div>
            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #E5E7EB", borderRadius: 10, background: "#FAFAFA", padding: "0 14px", gap: 10 }}>
              <span style={{ color: "#9CA3AF" }}><LockIcon /></span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ flex: 1, border: "none", background: "transparent", outline: "none", padding: "13px 0", fontSize: 14, color: "#111827", fontFamily: "inherit" }}
              />
              <span style={{ color: "#9CA3AF", cursor: "pointer" }} onClick={() => setShowPass(p => !p)}>
                <EyeIcon off={!showPass} />
              </span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p
              style={{
                color: "#DC2626",
                fontSize: 13,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          {/* Login button */}
          <button
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#9CA3AF" : "#2563EB",
              color: "white",
              border: "none",
              borderRadius: 12,
              padding: "15px",
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
            onClick={async () => {
              if (!email || !password) {
                setError("Please enter your email and password.");
                return;
              }

              setLoading(true);
              setError("");

              try {
                // Call login API which uses centralized axios instance
                const data = await loginApi({ email, password });

                // data = { message, token, user }
                // Store token for axios interceptor to pick up
                const userWithToken = {
                  ...data.user,
                  token: data.token,
                };

                // Persist to localStorage for persistence across page reloads
                localStorage.setItem("rentalBuddyUser", JSON.stringify(userWithToken));

                // Notify parent with the complete user object (includes token)
                onLoginSuccess(userWithToken);
              } catch (err: any) {
                const message =
                  err.response?.data?.message ||
                  err.message ||
                  "Login failed. Please try again.";
                setError(message);
              } finally {
                setLoading(false);
              }
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.background = "#1D4ED8";
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.background = "#2563EB";
            }}
          >
            {loading ? "Signing in..." : "Login →"}
          </button>

          {/* Divider */}
          <div style={{ position: "relative", margin: "24px 0", textAlign: "center" }}>
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "#F3F4F6" }} />
            <span style={{ position: "relative", background: "white", padding: "0 16px", fontSize: 12, color: "#9CA3AF", fontWeight: 500, letterSpacing: "0.05em" }}>
              OR CONTINUE WITH
            </span>
          </div>

          {/* Social buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            {[{ icon: <GoogleIcon />, label: "Google" }, { icon: <FacebookIcon />, label: "Facebook" }].map(({ icon, label }) => (
              <button key={label}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 16px", border: "1.5px solid #E5E7EB", borderRadius: 10, background: "white", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#374151", fontFamily: "inherit" }}
                onMouseOver={e => (e.currentTarget.style.background = "#F9FAFB")}
                onMouseOut={e => (e.currentTarget.style.background = "white")}
              >
                {icon}{label}
              </button>
            ))}
          </div>

          {/* Register link */}
          <p style={{ textAlign: "center", fontSize: 14, color: "#6B7280", marginTop: 24 }}>
            New to Rental Buddy?{" "}
            <button onClick={onGoRegister} style={{ background: "none", border: "none", color: "#2563EB", fontWeight: 600, cursor: "pointer", fontSize: 14, fontFamily: "inherit", padding: 0 }}>
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};