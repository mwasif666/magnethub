import { apiRequest } from "@/api/axiosInstance";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the structure of the user object
interface User {
  id: string;
  name?: string;
  email?: string;
  [key: string]: any; // allow additional properties if needed
}

interface AuthResponse {
  user?: User;
  data?: User;
  token?: string;
}

interface LoginData {
  email: string;
  password: string;
  [key: string]: any;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  [key: string]: any;
}

// Define the context type
interface AuthContextType {
  user: User | null;
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  loginUser: (loginData: LoginData) => Promise<AuthResponse>;
  registerUser: (registerData: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context with default value (undefined for safety)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedToken) setToken(savedToken);
      if (savedUser && savedToken) setIsAuthenticated(true);
    }
  }, []);

  const storeDataInLS = (res: AuthResponse) => {
    if (typeof window !== "undefined") {
      const userData = res.data || res.user;
      if (userData) localStorage.setItem("user", JSON.stringify(userData));
      if (res.token) localStorage.setItem("token", res.token);
    }

    setUser(res.user || res.data || null);
    setToken(res.token || null);
    setIsAuthenticated(true);
  };

  const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
    const res = await apiRequest({
      url: "LoginUser",
      method: "POST",
      data: loginData,
    });
    storeDataInLS(res);
    return res;
  };

  const registerUser = async (registerData: RegisterData): Promise<AuthResponse> => {
    const res = await apiRequest({
      url: "RegisterNewUser",
      method: "POST",
      data: registerData,
    });
    storeDataInLS(res);
    return res;
  };

  const userId = user ? user.id : null;

  const logout = (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      resolve();
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        userId,
        isAuthenticated,
        loginUser,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
