import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refresh-token';

const RETURN_ADMIN_TOKEN_KEY = 'auth-token-return';
const RETURN_ADMIN_REFRESHTOKEN_KEY = 'auth-refresh-token-return';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() {
  }

  signOut(): void {
    window.localStorage.clear();
    sessionStorage.clear();
    location.href = '/account/login';
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveRefreshToken(token: string): void {
    window.sessionStorage.removeItem(REFRESHTOKEN_KEY);
    window.sessionStorage.setItem(REFRESHTOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return window.sessionStorage.getItem(REFRESHTOKEN_KEY);
  }

  public clear() {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(REFRESHTOKEN_KEY);
  }

  public setTokenLoginWithOtherAccount(access_token: string, refresh_token: string) {
    window.sessionStorage.setItem(RETURN_ADMIN_TOKEN_KEY, this.getToken());
    window.sessionStorage.setItem(RETURN_ADMIN_REFRESHTOKEN_KEY, this.getRefreshToken());
    this.saveToken(access_token);
    this.saveRefreshToken(refresh_token);
  }

  public returnAdmin() {
    const returnToken = window.sessionStorage.getItem(RETURN_ADMIN_TOKEN_KEY);
    if (returnToken) {
      this.saveToken(returnToken);
      this.saveRefreshToken(window.sessionStorage.getItem(RETURN_ADMIN_REFRESHTOKEN_KEY));
      window.sessionStorage.removeItem(RETURN_ADMIN_TOKEN_KEY);
      window.sessionStorage.removeItem(RETURN_ADMIN_REFRESHTOKEN_KEY);
      location.href = '';
    }
  }

  public hasReturnAdmin(): boolean {
    const returnToken = window.sessionStorage.getItem(RETURN_ADMIN_TOKEN_KEY);
    return !!returnToken && returnToken.length > 0;
  }
}
