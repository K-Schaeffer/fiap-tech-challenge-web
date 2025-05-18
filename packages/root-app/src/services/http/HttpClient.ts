type RequestOptions = {
  headers?: Record<string, string>;
} & Omit<RequestInit, "headers">;

export class HttpClient {
  private static instance: HttpClient;
  private readonly baseUrl = "http://localhost:5000";
  private readonly AUTH_TOKEN_KEY = "auth_token";

  private constructor() {}

  static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;

    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`${this.AUTH_TOKEN_KEY}=`)
    );
    if (!tokenCookie) return null;
    return tokenCookie.split("=")[1];
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          document.cookie = `${this.AUTH_TOKEN_KEY}=; path=/; max-age=0; SameSite=Strict;`;
          window.location.href = "/login";
        }
        throw new Error("Authentication required");
      }
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return response.json();
  }

  get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(
    endpoint: string,
    data: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put<T>(
    endpoint: string,
    data: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}
