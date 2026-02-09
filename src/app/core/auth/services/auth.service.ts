import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { API } from '../../config/api.config';
import { TokenService } from './token.service';

import { User } from 'src/app/core/models/User';
import { environment } from 'src/environments/environment';

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


  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}


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

    return this.http
      .post<OAuthTokenResponse>(API.AUTH.TOKEN, body, { headers })
      .pipe(
        catchError((err) => {
          return throwError(() => err);
        })
      );
  }


  login(user: User): Observable<OAuthTokenResponse> {
    return this.requestToken(user).pipe(
      tap((data) => {
        if (data?.access_token) {
          this.tokenService.setToken(data.access_token);
        }
      })
    );
  }
}
