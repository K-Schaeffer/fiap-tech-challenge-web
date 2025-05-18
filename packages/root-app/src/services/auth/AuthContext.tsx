import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "./AuthService";
import { HttpAuthService } from "./HttpAuthService";

interface AuthContextData {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const authService: AuthService = new HttpAuthService();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return authService.isAuthenticated();
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    try {
      await authService.login(email, password);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  function logout() {
    authService.logout();
    setIsAuthenticated(false);
  }

  function getToken() {
    return authService.getToken();
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, login, logout, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
