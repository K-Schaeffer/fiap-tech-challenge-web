import { AuthService } from "./AuthService";

interface AuthResponse {
  token: string;
  userId: string;
}

export class HttpAuthService implements AuthService {
  private readonly AUTH_TOKEN_KEY = "auth_token";
  private readonly USER_ID_KEY = "user_id";
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json();
    this.setToken(data.token);
    this.setUserId(data.userId);
    return data;
  }

  logout(): void {
    this.removeToken();
    this.removeUserId();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null;

    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`${this.AUTH_TOKEN_KEY}=`)
    );
    if (!tokenCookie) return null;
    return tokenCookie.split("=")[1];
  }

  private getUserId(): string | null {
    if (typeof window === "undefined") return null;

    const cookies = document.cookie.split(";");
    const userIdCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`${this.USER_ID_KEY}=`)
    );
    if (!userIdCookie) return null;
    return userIdCookie.split("=")[1];
  }

  private setToken(token: string): void {
    if (typeof window === "undefined") return;

    const secureFlag = process.env.NODE_ENV === "production" ? "Secure;" : "";
    const cookieString = `${this.AUTH_TOKEN_KEY}=${token}; path=/; max-age=${
      7 * 24 * 60 * 60
    }; SameSite=Strict; ${secureFlag}`;
    document.cookie = cookieString;
  }

  private setUserId(userId: string): void {
    if (typeof window === "undefined") return;

    const secureFlag = process.env.NODE_ENV === "production" ? "Secure;" : "";
    const cookieString = `${this.USER_ID_KEY}=${userId}; path=/; max-age=${
      7 * 24 * 60 * 60
    }; SameSite=Strict; ${secureFlag}`;
    document.cookie = cookieString;
  }

  private removeToken(): void {
    if (typeof window === "undefined") return;

    document.cookie = `${this.AUTH_TOKEN_KEY}=; path=/; max-age=0; SameSite=Strict;`;
  }

  private removeUserId(): void {
    if (typeof window === "undefined") return;

    document.cookie = `${this.USER_ID_KEY}=; path=/; max-age=0; SameSite=Strict;`;
  }
}
