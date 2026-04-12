import axios, { AxiosRequestConfig, Method } from "axios";

export const BACKEND_ORIGIN = "https://dash.magnatehub.au";

const WEBSITE_API_DIRECT_BASE = `${BACKEND_ORIGIN}/api/website/`;

/** Browser uses same-origin proxy (see next.config rewrites). Server/build uses direct URL (no CORS). */
function resolveWebsiteApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_WEBSITE_API_BASE_URL;
  if (fromEnv) {
    return fromEnv.endsWith("/") ? fromEnv : `${fromEnv}/`;
  }
  if (typeof window !== "undefined") {
    return "/magnatehub-api/";
  }
  return WEBSITE_API_DIRECT_BASE;
}

export const WEBSITE_API_BASE_URL = resolveWebsiteApiBaseUrl();

const api = axios.create({
  baseURL: WEBSITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
  withCredentials: false,
  withXSRFToken: false,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

api.interceptors.request.use((config) => {
  if ((config as any).skipAuth || !(config as any).useAuthToken) {
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
  useAuthToken?: boolean;
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
  useAuthToken = false,
}: ApiRequestProps) => {
  try {
    const config: AxiosRequestConfig & {
      skipAuth?: boolean;
      useAuthToken?: boolean;
    } = {
      url,
      method,
      baseURL: baseURL || api.defaults.baseURL,
      withCredentials: withCredentials ?? false,
      withXSRFToken: withXSRFToken ?? false,
      ...(skipAuth ? { skipAuth: true } : {}),
      ...(useAuthToken ? { useAuthToken: true } : {}),
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
