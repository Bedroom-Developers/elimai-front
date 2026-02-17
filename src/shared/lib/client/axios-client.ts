import { useAuthStore } from "@/modules/auth";
import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

export const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKENDURL,
});

const publicRoutes: string[] = [
  "send-code",
  "verify-code",
  "reset-password",
];
axiosApi.interceptors.request.use(
  (config) => {
    if (config.url) {
      const isSkipRoute = publicRoutes.some((route) =>
        config.url?.includes(route)
      );
      if (isSkipRoute) return config;
    }
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${getCookie("access")}`; // or call a function to get the token

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
let refreshPromise: Promise<{ data: { access: string } }> | null = null;
axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const pathname = new URL(
      originalRequest.url,
      process.env.NEXT_PUBLIC_BACKENDURL
    ).pathname;
    const isSkipRoute = publicRoutes.some((route) =>
      pathname.startsWith(`/${route}`)
    );

    console.log(`[Interceptor] Error caught for ${pathname}`);
    if (isSkipRoute) {
      console.log("[Interceptor] Skip route matched, rejecting.");
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log(
        "[Interceptor] Handling 401 for request:",
        originalRequest.url
      );

      try {
        const refreshToken = getCookie("refresh");

        if (!refreshToken) {
          console.warn("[Interceptor] No refresh token found. Logging out.");
          deleteCookie("access");
          deleteCookie("refresh");
          throw new Error("No refresh token");
        }

        if (!refreshPromise) {
          console.log(
            "[Interceptor] No existing refreshPromise. Creating new one."
          );
          const promise = axios.post(
            `${process.env.NEXT_PUBLIC_BACKENDURL}token/refresh/`,
            {
              refresh: refreshToken,
            }
          );
          refreshPromise = promise;
        } else {
          console.log("[Interceptor] Using existing refreshPromise.");
        }

        const response = await refreshPromise;

        if (!response) {
          console.error(
            "[Interceptor] Refresh response is null. Clearing state."
          );
          deleteCookie("access");
          deleteCookie("refresh");
          refreshPromise = null;
          throw new Error("Failed to refresh");
        }

        console.log("[Interceptor] Refresh success:", response.data);

        const { access } = response.data;
        setCookie("access", access);

        axiosApi.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        originalRequest.headers["Authorization"] = `Bearer ${access}`;

        refreshPromise = null;

        console.log(
          "[Interceptor] Retrying original request:",
          originalRequest.url
        );
        return axiosApi(originalRequest);
      } catch (refreshError) {
        console.error("[Interceptor] Token refresh failed:", refreshError);
        deleteCookie("access");
        deleteCookie("refresh");
        refreshPromise = null;
        useAuthStore.getState().logout();
        window.location.pathname = `/${getCookie("NEXT_LOCALE") ?? "ru"}/login`;
        //set zustand store
        return Promise.reject(refreshError);
      }
    }

    console.log("[Interceptor] Not a 401 or already retried. Rejecting.");
    return Promise.reject(error);
  }
);
