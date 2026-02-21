import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Profile } from '../models/Profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  constructor(private http: HttpClient) {}

  getMe(): Observable<Profile> {
    return this.http.get<Profile>(`${API.USERS.ROOT}/me`);
  }
}

