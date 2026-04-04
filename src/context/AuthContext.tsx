"use client";
import { apiRequest, BACKEND_ORIGIN } from "@/api/axiosInstance";
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
  token?: string;
  user_id?: string;
  error?: boolean;
  type?: string;
  code?: string;
  otp?: string;
  message?: string;
}

interface sessionResponse {
  raising_id: string;
  name: string;
  email: string;
  profile: null;
  type: string;
  plan_type: string | null;
  plan_expiry: null;
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

interface OTP {
  code: string | any;
}

const formDataToObject = (formData: FormData) =>
  Object.fromEntries(formData.entries());

interface AuthContextType {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  loginUser: (loginData: LoginData | FormData) => Promise<AuthResponse>;
  verifiyOtp: (otp: OTP | FormData) => Promise<AuthResponse>;
  registerUser: (
    registerData: RegisterData | FormData
  ) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  role: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context with default value (undefined for safety)
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userId, setUserId] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user_id");
      const savedToken = localStorage.getItem("token");
      const saveRole = localStorage.getItem("role");

      if (savedUser) setUserId(JSON.parse(savedUser));
      if (savedToken) setToken(savedToken);
      if (saveRole) setRole(saveRole);
      if (savedUser) setIsAuthenticated(true);
    }
  }, []);

  const storeDataInLS = (res: any) => {
    const user = res?.user || res?.data?.user || res?.data;
    const nextToken = res?.token || res?._token || res?.data?.token || null;
    const nextRole = user?.role || res?.type || res?.data?.type || null;

    if (!res.error && user?.id) {
      if (typeof window !== "undefined") {
        localStorage.setItem("user_id", JSON.stringify(user.id));

        if (nextToken) {
          localStorage.setItem("token", nextToken);
        } else {
          localStorage.removeItem("token");
        }

        if (nextRole) {
          localStorage.setItem("role", nextRole);
        }
      }

      setUserId(String(user.id));
      setToken(nextToken);
      setRole(nextRole);
      setIsAuthenticated(true);
    }
  };

  const storeDataISession = (res: sessionResponse) => {
     sessionStorage.setItem("raising_id", JSON.stringify(res.raising_id));
     sessionStorage.setItem("name", JSON.stringify(res.name));
     sessionStorage.setItem("email", JSON.stringify(res.email));
     sessionStorage.setItem("profile", JSON.stringify(res.profile));
     sessionStorage.setItem("type", JSON.stringify(res.type));
     sessionStorage.setItem("plan_type", JSON.stringify(res.plan_type));
     sessionStorage.setItem("plan_expiry", JSON.stringify(res.plan_expiry));
  };

  const loginUser = async (
    loginData: LoginData | FormData
  ): Promise<AuthResponse> => {
    await apiRequest({
      url: "/sanctum/csrf-cookie",
      method: "GET",
      baseURL: BACKEND_ORIGIN,
      withCredentials: true,
      withXSRFToken: true,
      skipAuth: true,
    });

    const payload =
      loginData instanceof FormData ? formDataToObject(loginData) : loginData;

    const res = await apiRequest({
      url: "/professionals/login",
      method: "POST",
      baseURL: BACKEND_ORIGIN,
      data: payload,
      withCredentials: true,
      withXSRFToken: true,
      skipAuth: true,
    });
    if (!res.error) {
      storeDataInLS(res);
    }
    return res;
  };

  const registerUser = async (
    registerData: RegisterData | FormData
  ): Promise<AuthResponse> => {
    const res = await apiRequest({
      url: "signup",
      method: "POST",
      data: registerData,
      withCredentials: false,
    });
    return res;
  };

  const verifiyOtp = async (otp: OTP | FormData): Promise<AuthResponse> => {
    const res = await apiRequest({
      url: "Raising/Check/Otp",
      method: "POST",
      data: otp,
    });
    return res;
  };

  const logout = (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.removeItem("user");
      localStorage.removeItem("user_id");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      sessionStorage.removeItem("raising_id");
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("profile");
      sessionStorage.removeItem("type");
      sessionStorage.removeItem("plan_type");
      sessionStorage.removeItem("plan_expiry");
      setUserId("");
      setToken(null);
      setRole(null);
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
        verifiyOtp,
        logout,
        role,
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
