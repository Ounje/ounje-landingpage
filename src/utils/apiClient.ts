// Ounje backend API Client utility
import { useAuthStore } from "../hooks/useAuthStore";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://ounje-mobile-backend.pxxl.pro").replace(/\/$/, "");

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>;
  bodyData?: any;
  isMultipart?: boolean;
}

class ApiClient {
  private async getHeaders(isMultipart = false): Promise<Headers> {
    const headers = new Headers();
    if (!isMultipart) {
      headers.append("Content-Type", "application/json");
    }
    
    // Retrieve active access token from Zustand store state
    const token = useAuthStore.getState().token;
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }
    
    return headers;
  }

  private buildUrl(path: string, params?: Record<string, string | number>): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${BASE_URL}${cleanPath}`);
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        url.searchParams.append(key, String(val));
      });
    }
    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText || "An error occurred" };
      }
      throw {
        status: response.status,
        message: errorData.message || errorData.error?.message || "An error occurred",
        data: errorData,
      };
    }

    try {
      return await response.json() as T;
    } catch {
      return {} as T;
    }
  }

  public async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, bodyData, isMultipart = false, ...fetchOptions } = options;
    const url = this.buildUrl(path, params);
    
    const headers = await this.getHeaders(isMultipart);
    
    // If request contains custom headers, merge them
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, val]) => {
        headers.set(key, String(val));
      });
    }

    const config: RequestInit = {
      ...fetchOptions,
      headers,
    };

    if (bodyData) {
      config.body = isMultipart ? bodyData : JSON.stringify(bodyData);
    }

    try {
      const response = await fetch(url, config);
      
      // Auto-refresh token if 401 occurs
      if (response.status === 401 && path !== "/api/auth/refresh" && path !== "/api/auth/login") {
        const refreshed = await this.tryTokenRefresh();
        if (refreshed) {
          // Retry the request with the new token
          const retryHeaders = await this.getHeaders(isMultipart);
          if (options.headers) {
            Object.entries(options.headers).forEach(([key, val]) => {
              retryHeaders.set(key, String(val));
            });
          }
          const retryConfig = { ...config, headers: retryHeaders };
          const retryResponse = await fetch(url, retryConfig);
          return await this.handleResponse<T>(retryResponse);
        }
      }

      return await this.handleResponse<T>(response);
    } catch (err: any) {
      // Re-throw formatted errors
      if (err.status) throw err;
      throw { status: 500, message: err.message || "Network Error" };
    }
  }

  private async tryTokenRefresh(): Promise<boolean> {
    const refreshToken = localStorage.getItem("ounje_refresh_token");
    if (!refreshToken) {
      useAuthStore.getState().logout();
      return false;
    }

    try {
      const url = `${BASE_URL}/api/auth/refresh`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Refresh token expired or invalid");
      }

      const data = await response.json();
      if (data.accessToken) {
        // Update the access token in store
        useAuthStore.setState({ token: data.accessToken });
        return true;
      }

      throw new Error("No token returned");
    } catch (error) {
      console.error("Token refresh failed. Logging out...", error);
      useAuthStore.getState().logout();
      return false;
    }
  }

  public get<T>(path: string, params?: Record<string, string | number>, options?: Omit<RequestOptions, "bodyData">): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET", params });
  }

  public post<T>(path: string, body?: any, options?: Omit<RequestOptions, "bodyData">): Promise<T> {
    return this.request<T>(path, { ...options, method: "POST", bodyData: body });
  }

  public put<T>(path: string, body?: any, options?: Omit<RequestOptions, "bodyData">): Promise<T> {
    return this.request<T>(path, { ...options, method: "PUT", bodyData: body });
  }

  public delete<T>(path: string, options?: Omit<RequestOptions, "bodyData">): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
