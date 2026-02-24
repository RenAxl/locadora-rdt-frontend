import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Profile } from 'src/app/core/models/Profile';

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  constructor(private http: HttpClient) {}

  getMyPhoto(): Observable<Blob> {
    return this.http.get(`${API.USERS.ROOT}/me/photo`, {
      responseType: 'blob',
    });
  }

  getMe(): Observable<Profile> {
    return this.http.get<Profile>(`${API.USERS.ROOT}/me`);
  }
}
