import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { BACKEND_SERVER } from 'src/app/core/constants/api.constants';
import { Pagination } from 'src/app/core/models/Pagination';
import { Role } from 'src/app/core/models/Role';
import { RolePermissionsUpdateDTO } from 'src/app/features/roles/models/RolePermissionsUpdateDTO';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(private http: HttpClient) {}

  list(pagination: Pagination, filterName: string): Observable<any> {
    let params = new HttpParams()
      .set('authority', filterName)
      .set('page', pagination.page)
      .set('linesPerPage', pagination.linesPerPage)
      .set('direction', String(pagination.direction))
      .set('orderBy', String(pagination.orderBy));

    return this.http.get<any>(BACKEND_SERVER + 'roles', { params });
  }

  insert(role: Role): Observable<any> {
    return this.http.post<any>(BACKEND_SERVER + 'roles', role);
  }

  findById(id: any): Observable<any> {
    return this.http.get<any>(BACKEND_SERVER + 'roles/' + id);
  }

  updatePermissions(id: number,dto: RolePermissionsUpdateDTO,): Observable<any> {
    return this.http.put<any>(
      BACKEND_SERVER + 'roles/' + id + '/permissions',
      dto,
    );
  }
}
