import { useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../hooks/useProfile";
import { getMediaUrl } from "../../utils/media";
import { colors, borderRadius, spacing, typography, transitions } from "../../styles/designTokens";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { ProfileCard } from "../../components/profile/ProfileCard";
import { StatCard } from "../../components/profile/StatCard";
import { InfoCard } from "../../components/profile/InfoCard";
import { ActivityTimeline } from "../../components/profile/ActivityTimeline";
import { SecurityCard } from "../../components/profile/SecurityCard";
import { ProfileSkeleton } from "../../components/profile/ProfileSkeleton";
import { ProfileErrorState } from "../../components/profile/ProfileErrorState";
import { EditProfileModal } from "../../components/profile/EditProfileModal";
import { ChangePasswordModal } from "../../components/profile/ChangePasswordModal";

interface UserProfilePageProps {
  onNavigate: (page: string, params?: any) => void;
}

// SVG Icons
const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// SVG Icon for quick actions
const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const BookingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const GenderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const CakeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <line x1="9" y1="6" x2="10" y2="6" />
    <line x1="14" y1="6" x2="15" y2="6" />
    <line x1="9" y1="10" x2="10" y2="10" />
    <line x1="14" y1="10" x2="15" y2="10" />
    <line x1="9" y1="14" x2="10" y2="14" />
    <line x1="14" y1="14" x2="15" y2="14" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const UserProfilePage = ({ onNavigate }: UserProfilePageProps) => {
  const { user, logout } = useAuth();
  const {
    profile,
    loading,
    error,
    stats,
    activities,
    editLoading,
    passwordLoading,
    fetchProfile,
    updateProfile,
    updatePassword,
  } = useProfile();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    onNavigate("home");
  }, [logout, onNavigate]);

  // Not logged in state
  if (!user) {
    return (
      <div
        style={{
          maxWidth: 500,
          margin: "80px auto",
          padding: spacing["4xl"],
          textAlign: "center",
          background: colors.bgPrimary,
          borderRadius: borderRadius["3xl"],
          boxShadow: colors.shadowSm,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${colors.primaryLight}, ${colors.primaryBg})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            border: `2px solid ${colors.primaryLight}`,
          }}
        >
          <UserIcon />
        </div>
        <h2 style={{ ...typography.h3, color: colors.textPrimary, margin: "0 0 8px" }}>
          Please login to view your profile
        </h2>
        <p style={{ ...typography.body, color: colors.textSecondary, margin: "0 0 24px" }}>
          Sign in to access your profile, bookings, and more.
        </p>
        <Button variant="primary" size="lg" onClick={() => onNavigate("login")}>
          Login
        </Button>
      </div>
    );
  }

  const hasProfileData = Boolean(profile.name || profile.email || profile.profileImage || user?.name || user?.email);

  // Loading state
  if (loading && !hasProfileData) {
    return (
      <div style={{ background: colors.bgPage, minHeight: "100vh" }}>
        <ProfileSkeleton />
      </div>
    );
  }

  // Error state
  if (error && !hasProfileData) {
    return (
      <div style={{ background: colors.bgPage, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ProfileErrorState message={error} onRetry={fetchProfile} />
      </div>
    );
  }

  const initial = (profile.name || user?.name || "").charAt(0)?.toUpperCase() || "?";

  return (
    <div
      style={{
        background: colors.bgPage,
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: spacing["3xl"],
        }}
        className="profile-page-container"
      >
        {/* ═══════════════════════════════════════════════════
            PROFILE HEADER — Modernized with gradient accent
        ════════════════════════════════════════════════════ */}
        <ProfileCard>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: spacing.xl,
              flexWrap: "wrap",
            }}
            className="profile-header-content"
          >
            {/* Avatar with ring */}
            <div
              style={{
                position: "relative",
                width: 100,
                height: 100,
                borderRadius: "50%",
                overflow: "hidden",
                background: `linear-gradient(135deg, ${colors.primaryLight}, ${colors.bgTertiary})`,
                border: `3px solid ${colors.primary}20`,
                flexShrink: 0,
                boxShadow: `0 0 0 4px ${colors.primaryLight}, 0 4px 20px rgba(37, 99, 235, 0.15)`,
              }}
            >
              {profile.profileImage ? (
                <img
                  src={getMediaUrl(profile.profileImage || user?.profileImage || "")}
                  alt={profile.name || user?.name || "User"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 40,
                    fontWeight: 700,
                    color: colors.primary,
                    background: `linear-gradient(135deg, ${colors.primaryLight}, ${colors.primaryBg})`,
                  }}
                >
                  {initial}
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.sm,
                  flexWrap: "wrap",
                  marginBottom: 8,
                }}
              >
                <h1
                  style={{
                    ...typography.h1,
                    color: colors.textPrimary,
                    margin: 0,
                    fontWeight: 800,
                    fontSize: 26,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {profile.name || user?.name || "User"}
                </h1>
                <Badge variant={user.role === "admin" ? "warning" : "success"} size="sm">
                  {user.role === "admin" ? "Admin" : "Verified"}
                </Badge>
              </div>
              <p
                style={{
                  ...typography.body,
                  color: colors.textSecondary,
                  margin: "0 0 4px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ opacity: 0.4 }}><MailIcon /></span>
                {profile.email || user?.email || "No email available"}
              </p>
              {profile.phone && (
                <p
                  style={{
                    ...typography.small,
                    color: colors.textMuted,
                    margin: "0 0 2px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ opacity: 0.4 }}><PhoneIcon /></span>
                  {profile.phone}
                </p>
              )}
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                gap: spacing.sm,
                flexWrap: "wrap",
                flexShrink: 0,
              }}
            >
              <Button
                variant="primary"
                onClick={() => setEditModalOpen(true)}
                style={{ boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)" }}
              >
                <span style={{ display: "flex", marginRight: 4 }}><EditIcon /></span>
                Edit Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => setPasswordModalOpen(true)}
              >
                <span style={{ display: "flex", marginRight: 4 }}><LockIcon /></span>
                Change Password
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                style={{ color: colors.error }}
              >
                <span style={{ display: "flex", marginRight: 4 }}><LogoutIcon /></span>
                Logout
              </Button>
            </div>
          </div>
        </ProfileCard>

        {/* ═══════════════════════════════════════════════════
            STATISTICS — Refined with value display
        ════════════════════════════════════════════════════ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: spacing.lg,
            marginTop: spacing["2xl"],
            marginBottom: spacing["2xl"],
          }}
        >
          <StatCard
            label="Total Bookings"
            value={stats.totalBookings}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
            color={colors.primary}
          />
          <StatCard
            label="Completed"
            value={stats.completedBookings}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            }
            color={colors.success}
          />
          <StatCard
            label="Wishlist"
            value={stats.wishlistItems}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.warning} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            }
            color={colors.warning}
          />
          <StatCard
            label="Profile Completion"
            value={`${stats.profileCompletion}%`}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.info} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V10" />
                <path d="M18 20V4" />
                <path d="M6 20v-4" />
              </svg>
            }
            color={colors.info}
            trend={{
              value: `${stats.profileCompletion >= 80 ? "Great" : "Incomplete"}`,
              positive: stats.profileCompletion >= 80,
            }}
          />
        </div>

        {/* ═══════════════════════════════════════════════════
            MAIN CONTENT GRID — Wider sidebar
        ════════════════════════════════════════════════════ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: spacing["2xl"],
            alignItems: "start",
          }}
          className="profile-content-grid"
        >
          {/* LEFT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: spacing["2xl"] }}>
            {/* Account Information */}
            <ProfileCard
              title="Account Information"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
              action={
                <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)}>
                  <span style={{ display: "flex", marginRight: 6 }}><EditIcon /></span>
                  Edit
                </Button>
              }
            >
              <InfoCard
                rows={[
                  { label: "Full Name", value: profile.name, icon: <UserIcon /> },
                  { label: "Email", value: profile.email, icon: <MailIcon /> },
                  { label: "Phone", value: profile.phone || "", icon: <PhoneIcon /> },
                  { label: "Gender", value: profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "", icon: <GenderIcon /> },
                  { label: "Date of Birth", value: profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "", icon: <CakeIcon /> },
                  { label: "Address", value: profile.address || "", icon: <LocationIcon /> },
                  { label: "Preferred Location", value: profile.preferredLocation || "", icon: <BuildingIcon /> },
                  { label: "Preferred BHK", value: profile.preferredBHK || "", icon: <HomeIcon /> },
                  { label: "Account Status", value: user.role === "admin" ? "Admin" : "Active", icon: <CheckCircleIcon /> },
                  { label: "Member Since", value: "Recently", icon: <CalendarIcon /> },
                ]}
              />
            </ProfileCard>

            {/* Bio Section */}
            {profile.bio && (
              <ProfileCard
                title="About Me"
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                }
              >
                <p
                  style={{
                    ...typography.body,
                    color: colors.textSecondary,
                    margin: 0,
                    lineHeight: 1.8,
                    fontSize: 14,
                  }}
                >
                  {profile.bio}
                </p>
              </ProfileCard>
            )}

            {/* Security Section */}
            <ProfileCard
              title="Security"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
            >
              <SecurityCard onOpenChangePassword={() => setPasswordModalOpen(true)} />
            </ProfileCard>

            {/* Quick Actions */}
            <ProfileCard
              title="Quick Actions"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              }
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: spacing.sm,
                }}
              >
                {[
                  { label: "View Wishlist", page: "wishlist", icon: <HeartIcon />, desc: "Your saved properties" },
                  { label: "My Bookings", page: "bookings", icon: <BookingsIcon />, desc: "View all bookings" },
                  { label: "Dashboard", page: "dashboard", icon: <DashboardIcon />, desc: "Analytics overview" },
                  { label: "Browse Properties", page: "properties", icon: <HomeIcon />, desc: "Find your home" },
                ].map((action) => (
                  <button
                    key={action.page}
                    onClick={() => onNavigate(action.page)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: spacing.sm,
                      padding: `${spacing.lg}px`,
                      background: colors.bgSecondary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: borderRadius.xl,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textAlign: "left",
                      transition: transitions.fast,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = colors.primary;
                      e.currentTarget.style.background = colors.primaryLight;
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = `0 4px 12px rgba(37, 99, 235, 0.1)`;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = colors.border;
                      e.currentTarget.style.background = colors.bgSecondary;
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: borderRadius.lg,
                        background: colors.bgPrimary,
                        border: `1px solid ${colors.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colors.primary,
                      }}
                    >
                      {action.icon}
                    </div>
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: 13,
                          fontWeight: 600,
                          color: colors.textPrimary,
                          marginBottom: 2,
                        }}
                      >
                        {action.label}
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: 11,
                          color: colors.textMuted,
                          fontWeight: 400,
                        }}
                      >
                        {action.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </ProfileCard>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: spacing["2xl"] }}>
            {/* Recent Activity */}
            <ProfileCard
              title="Recent Activity"
              subtitle="Your latest account activity"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
            >
              <ActivityTimeline activities={activities} />
            </ProfileCard>

            {/* Quick Stats Mini Card */}
            <ProfileCard variant="compact">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: spacing.md,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 12, color: colors.textTertiary, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Saved Properties
                  </span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: colors.textPrimary }}>
                    {stats.savedProperties}
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: colors.bgTertiary,
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(stats.profileCompletion, 100)}%`,
                      background: `linear-gradient(90deg, ${colors.primary}, ${colors.primary}88)`,
                      borderRadius: 999,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: colors.textMuted,
                  }}
                >
                  <span>Profile strength</span>
                  <span>{stats.profileCompletion}%</span>
                </div>
              </div>
            </ProfileCard>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            MODALS
        ════════════════════════════════════════════════════ */}
        <EditProfileModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={updateProfile}
          initialData={profile}
          loading={editLoading}
        />

        <ChangePasswordModal
          isOpen={passwordModalOpen}
          onClose={() => setPasswordModalOpen(false)}
          onSave={updatePassword}
          loading={passwordLoading}
        />
      </div>

      {/* ═══════════════════════════════════════════════════
          RESPONSIVE STYLES
      ════════════════════════════════════════════════════ */}
      <style>{`
        @media (max-width: 1024px) {
          .profile-content-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .profile-page-container {
            padding: 16px !important;
          }
          .profile-header-content {
            flex-direction: column !important;
            text-align: center !important;
            align-items: center !important;
          }
          .profile-header-content > div:last-child {
            justify-content: center !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};