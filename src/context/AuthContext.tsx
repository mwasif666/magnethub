"use client";
import { apiRequest } from "@/api/axiosInstance";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the structure of the user object
interface User {
  id: string;
  name?: string;
  email?: string;
  [key: string]: any; 
}

interface AuthResponse {
  user?: User;
  data?: User;
  _token?: string;
  user_id?:string;
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

interface AuthContextType {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  loginUser: (loginData: LoginData | FormData) => Promise<AuthResponse>;
  registerUser: (registerData: RegisterData | FormData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context with default value (undefined for safety)
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userId, setUserId] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user_id");
      const savedToken = localStorage.getItem("token");

      if (savedUser) setUserId(JSON.parse(savedUser));
      if (savedToken) setToken(savedToken);
      if (savedUser && savedToken) setIsAuthenticated(true);
    }
  }, []);

  const storeDataInLS = (res: AuthResponse) => {
    if (typeof window !== "undefined") {
      if (res.user_id) localStorage.setItem("user_id", JSON.stringify(res.user_id));
      if (res._token) localStorage.setItem("token", res._token);
    }

    setUserId(res.user_id || '');
    setToken(res._token || null);
    setIsAuthenticated(true);
  };

  const loginUser = async (
    loginData: LoginData | FormData
  ): Promise<AuthResponse> => {
    const res = await apiRequest({
      url: "/Raising/Login",
      method: "POST",
      data: loginData,
    });
    storeDataInLS(res);
    return res;
  };

  const registerUser = async (
    registerData: RegisterData | FormData
  ): Promise<AuthResponse> => {
    const res = await apiRequest({
      url: "RegisterNewUser",
      method: "POST",
      data: registerData,
    });
    storeDataInLS(res);
    return res;
  };


  const logout = (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUserId('');
      setToken(null);
      setIsAuthenticated(false);
      resolve();
    });
  };

  return (
    <AuthContext.Provider
      value={{
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
