import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  error: string | null;
  login: (password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    setIsLoadingAuth(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/login", {
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
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      setIsLoadingAuth(false);
      return false;
    }
  };

  const value: AuthContextType = {
    token,
    isAuthenticated: !!token,
    isLoadingAuth,
    error,
    login,
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
