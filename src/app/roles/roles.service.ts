import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { AppConstants } from '../app-constant';
import { Pagination } from '../core/models/Pagination';
import { Role } from '../core/models/Role';

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

    return this.http.get<any>(AppConstants.backendServer + 'roles', { params });
  }

  insert(role: Role): Observable<any> {
    return this.http.post<any>(AppConstants.backendServer + 'roles', role);
  }

  findById(id: any): Observable<any> {
    return this.http.get<any>(AppConstants.backendServer + 'roles/' + id);
  }

  update(role: Role): Observable<any> {
    console.log(role);
    return this.http.put<any>(
      AppConstants.backendServer + 'roles/' + role.id,
      role,
    );
  }
}
