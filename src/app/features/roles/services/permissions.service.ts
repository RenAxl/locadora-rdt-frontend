import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Permission } from 'src/app/features/roles/models/Permission';
import { API } from 'src/app/core/config/api.config';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  constructor(private http: HttpClient) {}

  listGroups(): Observable<string[]> {
    return this.http.get<string[]>(API.PERMISSIONS.GROUPS);
  }

  listByGroup(groupName: string): Observable<Permission[]> {
    const params = new HttpParams().set('groupName', groupName || '');

    return this.http.get<Permission[]>(API.PERMISSIONS.ROOT, { params });
  }
}
