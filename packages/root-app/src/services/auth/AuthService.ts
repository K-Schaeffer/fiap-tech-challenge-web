export interface AuthResponse {
  token: string;
}

export interface AuthService {
  login(email: string, password: string): Promise<AuthResponse>;
  logout(): void;
  isAuthenticated(): boolean;
  getToken(): string | null;
}
