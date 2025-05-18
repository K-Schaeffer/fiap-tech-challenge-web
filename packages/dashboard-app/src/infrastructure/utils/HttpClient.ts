type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method: HttpMethod;
  body?: unknown;
  cache?: RequestCache;
}

export class HttpClient {
  constructor(private readonly baseUrl: string) {}
  private AUTH_TOKEN_KEY = "auth_token";

  private async request<T>(path: string, options: RequestOptions): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          this.deleteAuthToken();
          window.location.href = "/";
        }
        throw new Error("Authentication required");
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  private deleteAuthToken(): void {
    if (typeof window !== "undefined") {
      document.cookie = `${this.AUTH_TOKEN_KEY}=; path=/; max-age=0; SameSite=Strict;`;
    }
  }

  private getAuthToken(): string | null {
    const cookies = document.cookie.split(";");

    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(this.AUTH_TOKEN_KEY)
    );

    if (!tokenCookie) return null;

    return tokenCookie.split("=")[1];
  }

  async get<T>(path: string, cache?: RequestCache): Promise<T> {
    return this.request<T>(path, { method: "GET", cache });
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, { method: "POST", body });
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, { method: "PUT", body });
  }

  async delete(path: string): Promise<void> {
    await this.request(path, { method: "DELETE" });
  }
}
