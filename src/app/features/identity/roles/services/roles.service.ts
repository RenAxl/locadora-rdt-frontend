import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Pagination } from 'src/app/core/models/Pagination';
import { RolePermissionsUpdateDTO } from 'src/app/features/identity/roles/models/RolePermissionsUpdateDTO';
import { API } from 'src/app/core/config/api.config';
import { Role } from '../models/Role';
import { PageResponse } from 'src/app/core/models/page-response';
import { RoleDTO } from '../dtos/role.dto';
import { RoleDetailsDTO } from '../dtos/role-details.dto';
import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<RoleDTO>> {
    const params = buildPaginationParams(pagination, 'authority', filterName);

    return this.http.get<PageResponse<RoleDTO>>(API.ROLES.ROOT, { params });
  }

  insert(role: Role): Observable<RoleDTO> {
    return this.http.post<RoleDTO>(API.ROLES.ROOT, role);
  }

  findById(id: number | string): Observable<RoleDetailsDTO> {
    return this.http.get<RoleDetailsDTO>(API.ROLES.BY_ID(id));
  }

  updatePermissions(
    id: number,
    dto: RolePermissionsUpdateDTO,
  ): Observable<void> {
    return this.http.put<void>(API.ROLES.PERMISSIONS(id), dto);
  }
}
