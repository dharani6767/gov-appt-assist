import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// Types for our auth system
export interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for frontend-only phase
const MOCK_USERS: Array<User & { password: string }> = [
  { id: "1", name: "Admin User", email: "admin@hospital.gov", password: "admin123", role: "admin" },
  { id: "2", name: "Ravi Kumar", email: "ravi@example.com", password: "patient123", role: "patient" },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("hospital_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("hospital_token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API delay
      await new Promise((r) => setTimeout(r, 800));
      const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
      if (!found) throw new Error("Invalid email or password");
      const { password: _, ...userData } = found;
      const mockToken = "mock-jwt-token-" + userData.id;
      setUser(userData);
      setToken(mockToken);
      localStorage.setItem("hospital_user", JSON.stringify(userData));
      localStorage.setItem("hospital_token", mockToken);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 800));
      if (MOCK_USERS.find((u) => u.email === email)) {
        throw new Error("Email already registered");
      }
      const newUser: User = { id: String(Date.now()), name, email, role: "patient" };
      const mockToken = "mock-jwt-token-" + newUser.id;
      setUser(newUser);
      setToken(mockToken);
      localStorage.setItem("hospital_user", JSON.stringify(newUser));
      localStorage.setItem("hospital_token", mockToken);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("hospital_user");
    localStorage.removeItem("hospital_token");
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        loading,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
