import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

/** Hardcoded credentials for demo (do not use in production). */
const DEMO_USER = 'admin';
const DEMO_PASSWORD = 'admin123';

const AUTH_TOKEN_KEY = 'rmg_auth_token';

/**
 * Handles simulated user authentication.
 * Uses sessionStorage to persist login state across page refreshes.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSignal = signal<string | null>(
    typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(AUTH_TOKEN_KEY) : null
  );

  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  constructor(private router: Router) {}

  /**
   * Simulates login. Accepts hardcoded credentials only.
   * @returns true if credentials match, false otherwise
   */
  login(username: string, password: string): boolean {
    if (username === DEMO_USER && password === DEMO_PASSWORD) {
      const token = btoa(`${username}:${Date.now()}`);
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
      this.tokenSignal.set(token);
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    this.tokenSignal.set(null);
    this.router.navigate(['/login']);
  }
}
