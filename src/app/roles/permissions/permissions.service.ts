import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConstants } from '../../app-constant';
import { Permission } from 'src/app/core/models/Permission';


@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  constructor(private http: HttpClient) {}

  listGroups(): Observable<string[]> {
    return this.http.get<string[]>(
      AppConstants.backendServer + 'permissions/groups'
    );
  }

  listByGroup(groupName: string): Observable<Permission[]> {
    const params = new HttpParams().set('groupName', groupName || '');
    return this.http.get<Permission[]>(
      AppConstants.backendServer + 'permissions',
      { params }
    );
  }
}
