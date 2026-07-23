import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import {
  CustomerAccountPassword,
  CustomerAccountRegistration,
} from '../models/customer-account';

@Injectable({ providedIn: 'root' })
export class CustomerAccountService {
  constructor(private http: HttpClient) {}

  register(data: CustomerAccountRegistration): Observable<void> {
    return this.http.post<void>(API.CUSTOMER_ACCOUNT.REGISTER, data);
  }

  createPassword(token: string, data: CustomerAccountPassword): Observable<void> {
    const params = new HttpParams().set('token', token);
    return this.http.post<void>(API.CUSTOMER_ACCOUNT.CREATE_PASSWORD, data, { params });
  }

  resendActivation(email: string): Observable<void> {
    return this.http.post<void>(API.CUSTOMER_ACCOUNT.RESEND_ACTIVATION, { email });
  }
}
