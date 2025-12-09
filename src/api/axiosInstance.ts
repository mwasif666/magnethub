import axios, { AxiosRequestConfig, Method } from "axios";

const api = axios.create({
  baseURL: "https://dash.magnatehub.au/",
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
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
}

export const apiRequest = async ({
  url,
  method = "GET",
  data = null,
  baseURL = null,
  headers = {},
}: ApiRequestProps) => {
  try {
    const config: AxiosRequestConfig = {
      url,
      method,
      baseURL: baseURL || api.defaults.baseURL,
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
