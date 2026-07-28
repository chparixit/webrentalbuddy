import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toast } from "./components/Toast";
import { LoginPage } from "./pages/Login/login";
import { RegisterPage } from "./pages/register/register";
import Dashboard from "./pages/dashboard/dashboard";
import { HomePage } from "./pages/Home/HomePage";
import { PropertyListingPage } from "./pages/Properties/PropertyListingPage";
import { PropertyDetailsPage } from "./pages/Properties/PropertyDetailsPage";
import { BookingHistoryPage } from "./pages/Bookings/BookingHistoryPage";
import { WishlistPage } from "./pages/Wishlist/WishlistPage";
import { BookingPage } from "./pages/Bookings/BookingPage";
import { UserProfilePage } from "./pages/Profile/UserProfilePage";
import { AboutPage } from "./pages/About/AboutPage";
import { ContactPage } from "./pages/Contact/ContactPage";
import { NotFoundPage } from "./pages/NotFound/NotFoundPage";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminAddProperty } from "./pages/admin/AdminAddProperty";
import { AdminEditProperty } from "./pages/admin/AdminEditProperty";
import { AdminPropertyManagement } from "./pages/admin/AdminPropertyManagement";
import { AdminBookingManagement } from "./pages/admin/AdminBookingManagement";
import { ProfileUpdateForm } from "./components/profile/ProfileUpdateForm";
import { PasswordUpdateForm } from "./components/profile/PasswordUpdateForm";

type Page =
  | "home"
  | "login"
  | "register"
  | "dashboard"
  | "profile"
  | "profile-update"
  | "password-update"
  | "properties"
  | "property-details"
  | "booking"
  | "bookings"
  | "wishlist"
  | "about"
  | "contact"
  | "admin"
  | "admin-users"
  | "admin-properties"
  | "admin-add-property"
  | "admin-edit-property"
  | "admin-bookings"
  | "not-found";

interface PageParams {
  id?: string;
  search?: string;
  city?: string;
  [key: string]: any;
}

const AUTH_PAGES = [
  "dashboard",
  "profile",
  "profile-update",
  "password-update",
  "booking",
  "bookings",
  "wishlist",
];

const ADMIN_PAGES = [
  "admin",
  "admin-users",
  "admin-properties",
  "admin-add-property",
  "admin-edit-property",
  "admin-bookings",
];

const KNOWN_PAGES: Page[] = [
  "home",
  "login",
  "register",
  "dashboard",
  "profile",
  "profile-update",
  "password-update",
  "properties",
  "property-details",
  "booking",
  "bookings",
  "wishlist",
  "about",
  "contact",
  "admin",
  "admin-users",
  "admin-properties",
  "admin-add-property",
  "admin-edit-property",
  "admin-bookings",
];

const LoadingScreen = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#F9FAFB",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 32 32"
        fill="none"
        style={{ margin: "0 auto 16px" }}
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="#2563EB" />
        <path d="M8 22V13l8-5 8 5v9" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        <rect x="13" y="16" width="6" height="6" rx="1" fill="white" />
      </svg>
      <p style={{ color: "#6B7280", fontSize: 14 }}>Loading...</p>
    </div>
  </div>
);

const AppContent = () => {
  const { user, setUser, loading } = useAuth();
  const [page, setPage] = useState<Page>("home");
  const [pageParams, setPageParams] = useState<PageParams>({});

  const handleNavigate = (newPage: string, params?: PageParams) => {
    setPage(newPage as Page);
    if (params) setPageParams(params);
    else setPageParams({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("rentalBuddyUser");
    setPage("home");
  };

  useEffect(() => {
    if (loading) return;

    if (AUTH_PAGES.includes(page) && !user) {
      handleNavigate("login");
    } else if (ADMIN_PAGES.includes(page)) {
      if (!user || user.role !== "admin") {
        handleNavigate("home");
      }
    }
  }, [page, user, loading]);

  if (loading) return <LoadingScreen />;

  const isPageNotFound =
    !KNOWN_PAGES.includes(page) ||
    page === "not-found" ||
    (page === "booking" && !pageParams.id) ||
    (page === "property-details" && !pageParams.id);

  const showNavbar = !["login", "register"].includes(page) && !isPageNotFound;
  const showFooter = showNavbar && !ADMIN_PAGES.includes(page);
  const isLoginPage = page === "login" || page === "register";

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        minHeight: "100vh",
        background: "#F9FAFB",
      }}
    >
      {showNavbar && (
        <Navbar
          user={user}
          currentPage={page}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      <Toast />

      {isLoginPage ? (
        <>
          {page === "login" && (
            <LoginPage
              onGoRegister={() => handleNavigate("register")}
              onLoginSuccess={(userData: any) => {
                setUser(userData);
                localStorage.setItem("rentalBuddyUser", JSON.stringify(userData));
                handleNavigate("dashboard");
              }}
            />
          )}
          {page === "register" && (
            <RegisterPage onGoLogin={() => handleNavigate("login")} />
          )}
        </>
      ) : (
        <main id="main-content" role="main">
          {page === "home" && <HomePage onNavigate={handleNavigate} />}

          {user && page === "dashboard" && (
            <Dashboard
              user={user}
              onGoProfileUpdate={() => handleNavigate("profile-update")}
              onGoPasswordUpdate={() => handleNavigate("password-update")}
              onNavigate={handleNavigate}
            />
          )}

          {user && page === "profile" && (
            <UserProfilePage onNavigate={handleNavigate} />
          )}

          {user && page === "profile-update" && (
            <div style={{ padding: "40px", maxWidth: 600, margin: "0 auto" }}>
              <button
                onClick={() => handleNavigate("profile")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563EB",
                  cursor: "pointer",
                  fontSize: 14,
                  marginBottom: 20,
                  fontFamily: "inherit",
                }}
              >
                &larr; Back to Profile
              </button>
              <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "#111827" }}>
                Update Profile
              </h1>
              <ProfileUpdateForm user={user} onBack={() => handleNavigate("profile")} />
            </div>
          )}

          {user && page === "password-update" && (
            <div style={{ padding: "40px", maxWidth: 600, margin: "0 auto" }}>
              <button
                onClick={() => handleNavigate("profile")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563EB",
                  cursor: "pointer",
                  fontSize: 14,
                  marginBottom: 20,
                  fontFamily: "inherit",
                }}
              >
                &larr; Back to Profile
              </button>
              <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: "#111827" }}>
                Change Password
              </h1>
              <PasswordUpdateForm user={user} onBack={() => handleNavigate("profile")} />
            </div>
          )}

          {page === "properties" && (
            <PropertyListingPage onNavigate={handleNavigate} />
          )}

          {!isPageNotFound && page === "property-details" && pageParams.id && (
            <PropertyDetailsPage
              propertyId={pageParams.id}
              onNavigate={handleNavigate}
            />
          )}

          {user && !isPageNotFound && page === "booking" && pageParams.id && (
            <BookingPage
              propertyId={pageParams.id}
              onNavigate={handleNavigate}
            />
          )}

          {user && page === "bookings" && (
            <BookingHistoryPage onNavigate={handleNavigate} />
          )}

          {user && page === "wishlist" && (
            <WishlistPage onNavigate={handleNavigate} />
          )}

          {page === "about" && <AboutPage onNavigate={handleNavigate} />}

          {page === "contact" && <ContactPage onNavigate={handleNavigate} />}

          {user && page === "admin" && user.role === "admin" && (
            <AdminDashboardPage
              onNavigate={handleNavigate}
              onBack={() => handleNavigate("dashboard")}
              activePage={page}
            />
          )}

          {user && page === "admin-users" && user.role === "admin" && (
            <AdminUsers onBack={() => handleNavigate("admin")} />
          )}

          {user && page === "admin-properties" && user.role === "admin" && (
            <AdminPropertyManagement
              onBack={() => handleNavigate("admin")}
              onAddProperty={() => handleNavigate("admin-add-property")}
              onEditProperty={(id) => handleNavigate("admin-edit-property", { id })}
            />
          )}

          {user && page === "admin-add-property" && user.role === "admin" && (
            <AdminAddProperty onBack={() => handleNavigate("admin-properties")} />
          )}

          {user && page === "admin-edit-property" && user.role === "admin" && pageParams.id && (
            <AdminEditProperty
              propertyId={pageParams.id}
              onBack={() => handleNavigate("admin-properties")}
            />
          )}

          {user && page === "admin-bookings" && user.role === "admin" && (
            <AdminBookingManagement onBack={() => handleNavigate("admin")} />
          )}

          {isPageNotFound && <NotFoundPage onNavigate={handleNavigate} />}
        </main>
      )}

      {showFooter && <Footer onNavigate={handleNavigate} />}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
