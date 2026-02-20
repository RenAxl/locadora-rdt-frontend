import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { API } from '../../config/api.config';
import { TokenService } from './token.service';

import { User } from 'src/app/core/models/User';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

type OAuthTokenResponse = {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private decodedToken: any = null;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private jwtHelper: JwtHelperService
  ) {
    this.loadDecodedTokenFromStorage();
  }

  requestToken(user: User): Observable<OAuthTokenResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: environment.oauthBasicAuth,
    });

    const body = new URLSearchParams({
      username: user.email ?? '',
      password: user.password ?? '',
      grant_type: 'password',
    }).toString();

    return this.http.post<OAuthTokenResponse>(API.AUTH.TOKEN, body, { headers }).pipe(
      catchError((err) => throwError(() => err))
    );
  }

  login(user: User): Observable<OAuthTokenResponse> {
    return this.requestToken(user).pipe(
      tap((data) => {
        if (data?.access_token) {
          this.tokenService.setToken(data.access_token);
          this.decodedToken = this.jwtHelper.decodeToken(data.access_token);
        }
      })
    );
  }

  logout(): void {
    this.tokenService.clearToken();
    this.decodedToken = null;
  }

  isAccessTokenInvalid(): boolean {
    const token = this.getToken();
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  hasAuthority(authority: string): boolean {
    if (!authority) return false;
    return this.getAuthorities().includes(authority.trim());
  }

  hasAnyAuthority(authorities: string[]): boolean {
    if (!authorities || authorities.length === 0) return true;
    return authorities.some((a) => this.hasAuthority(a));
  }

  hasAllAuthorities(authorities: string[]): boolean {
    if (!authorities || authorities.length === 0) return true;
    return authorities.every((a) => this.hasAuthority(a));
  }

  getUsernameFromToken(): string | null {
    return this.decodedToken?.user_name ?? null;
  }

  private getToken(): string | null {
    const tokenFromService = (this.tokenService as any).getToken?.();
    return tokenFromService ?? localStorage.getItem('token');
  }

  private loadDecodedTokenFromStorage(): void {
    const token = this.getToken();
    if (token) {
      this.decodedToken = this.jwtHelper.decodeToken(token);
    }
  }

  private getAuthorities(): string[] {
    if (!this.decodedToken) {
      this.loadDecodedTokenFromStorage();
    }

    const list = this.decodedToken?.authorities;

    if (!Array.isArray(list)) return [];

    return list
      .filter((x: any) => typeof x === 'string')
      .map((x: string) => x.trim());
  }
}