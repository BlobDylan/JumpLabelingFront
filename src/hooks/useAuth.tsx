import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_API_URL;

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  login: (password: string) => Promise<boolean>;
  unauthorizedFallback: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false);

  // Check for existing token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    setIsLoadingAuth(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setToken(data.token);
      localStorage.setItem("authToken", data.token);
      setIsLoadingAuth(false);
      return true;
    } catch (err) {
      setIsLoadingAuth(false);
      return false;
    }
  };
  const unauthorizedFallback = () => {
    setToken(null);
    localStorage.removeItem("authToken");
  };

  const value: AuthContextType = {
    token,
    isAuthenticated: !!token,
    isLoadingAuth,
    login,
    unauthorizedFallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
