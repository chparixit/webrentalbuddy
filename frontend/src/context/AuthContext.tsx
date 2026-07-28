import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  profileImage: string;
  preferredBHK?: string;
  preferredLocation?: string;
  role?: string; // "admin" | "user" — added for admin access control
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("rentalBuddyUser");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("rentalBuddyUser");
      }
    }
    setLoading(false);
  }, []);

  const setUserAndPersist = (userData: User | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("rentalBuddyUser", JSON.stringify(userData));
    } else {
      localStorage.removeItem("rentalBuddyUser");
    }
  };

  const logout = () => {
    setUserAndPersist(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser: setUserAndPersist, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};