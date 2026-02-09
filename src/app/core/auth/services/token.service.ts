import { Injectable } from '@angular/core';
import { tokenGetter } from '../utils/token-getter';
import { TOKEN_KEY } from '../constants/token.constants';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  getToken(): string | null {
    return tokenGetter();
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

}
