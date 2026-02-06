import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Pagination } from 'src/app/core/models/Pagination';
import { Role } from 'src/app/core/models/Role';
import { RolePermissionsUpdateDTO } from 'src/app/features/roles/models/RolePermissionsUpdateDTO';
import { API } from 'src/app/core/config/api.config';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(private http: HttpClient) {}

  list(pagination: Pagination, filterName: string): Observable<any> {
    const params = new HttpParams()
      .set('authority', filterName || '')
      .set('page', String(pagination.page))
      .set('linesPerPage', String(pagination.linesPerPage))
      .set('direction', String(pagination.direction))
      .set('orderBy', String(pagination.orderBy));

    return this.http.get<any>(API.ROLES.ROOT, { params });
  }

  insert(role: Role): Observable<any> {
    return this.http.post<any>(API.ROLES.ROOT, role);
  }

  findById(id: number | string): Observable<any> {
    return this.http.get<any>(API.ROLES.BY_ID(id));
  }

  updatePermissions(
    id: number,
    dto: RolePermissionsUpdateDTO,
  ): Observable<void> {
    return this.http.put<void>(API.ROLES.PERMISSIONS(id), dto);
  }

}
