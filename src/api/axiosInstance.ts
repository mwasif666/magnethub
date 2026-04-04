import axios, { AxiosRequestConfig, Method } from "axios";

export const BACKEND_ORIGIN = "https://dash.magnatehub.au";
export const WEBSITE_API_BASE_URL = `${BACKEND_ORIGIN}/api/website/`;

const api = axios.create({
  baseURL: WEBSITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

api.interceptors.request.use((config) => {
  if ((config as any).skipAuth) {
    return config;
  }

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || sessionStorage.getItem("token")
      : null;

  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }

  return config;
});

interface ApiRequestProps {
  url: string;
  method?: Method;
  data?: any;
  baseURL?: string | null;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  withXSRFToken?: boolean;
  skipAuth?: boolean;
}

export const apiRequest = async ({
  url,
  method = "GET",
  data = null,
  baseURL = null,
  headers = {},
  withCredentials,
  withXSRFToken,
  skipAuth = false,
}: ApiRequestProps) => {
  try {
    const config: AxiosRequestConfig & { skipAuth?: boolean } = {
      url,
      method,
      baseURL: baseURL || api.defaults.baseURL,
      withCredentials: withCredentials ?? api.defaults.withCredentials,
      withXSRFToken: withXSRFToken ?? true,
      ...(skipAuth ? { skipAuth: true } : {}),
      headers: {
        ...headers,
      },
    };

    if (data instanceof FormData) {
      config.headers = {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      };
    }

    if (method.toUpperCase() === "GET") {
      config.params = data;
    } else {
      config.data = data;
    }

    const response = await api(config);
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    throw error?.response || error;
  }
};

export default api;
