import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Profile } from '../models/Profile';
import { ChangePassword } from '../models/ChangePassword';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getMe(): Observable<Profile> {
    return this.http.get<Profile>(`${API.USERS.ROOT}/me`);
  }

  updateMe(payload: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${API.USERS.ROOT}/me`, payload);
  }

  changePassword(payload: ChangePassword): Observable<void> {
    return this.http.put<void>(`${API.USERS.ROOT}/me/password`, {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
    });
  }

  getMyPhoto(): Observable<Blob> {
    return this.http.get(`${API.USERS.ROOT}/me/photo`, {
      responseType: 'blob',
    });
  }

  updateMyPhoto(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put<void>(`${API.USERS.ROOT}/me/photo`, formData);
  }
}