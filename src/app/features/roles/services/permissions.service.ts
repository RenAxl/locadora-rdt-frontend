import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Permission } from 'src/app/features/roles/models/Permission';
import { BACKEND_SERVER } from 'src/app/core/constants/api.constants';


@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  constructor(private http: HttpClient) {}

  listGroups(): Observable<string[]> {
    return this.http.get<string[]>(
      BACKEND_SERVER + 'permissions/groups'
    );
  }

  listByGroup(groupName: string): Observable<Permission[]> {
    const params = new HttpParams().set('groupName', groupName || '');
    return this.http.get<Permission[]>(
      BACKEND_SERVER + 'permissions',
      { params }
    );
  }
}
