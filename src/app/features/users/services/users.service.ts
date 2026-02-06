import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { User } from '../../../core/models/User';
import { API } from 'src/app/core/config/api.config';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  list(pagination: Pagination, filterName: string): Observable<any> {
    let params = new HttpParams()
      .set('name', filterName)
      .set('page', pagination.page)
      .set('linesPerPage', pagination.linesPerPage)
      .set('direction', String(pagination.direction))
      .set('orderBy', String(pagination.orderBy));

    return this.http.get<any>(API.USERS.ROOT, { params });
  }

  insert(user: User): Observable<any> {
    return this.http.post<any>(API.USERS.ROOT, user);
  }

  findById(id: any): Observable<any> {
    return this.http.get<any>(API.USERS.BY_ID(id));
  }

  update(user: User): Observable<any> {
    if (!user.id) {
      throw new Error('ID do usuário obrigatório para atualização.');
    }

    return this.http.put<User>(API.USERS.BY_ID(user.id), user);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(API.USERS.BY_ID(id));
  }

  deleteAll(ids: number[]): Observable<void> {
    return this.http.delete<void>(API.USERS.DELETE_ALL, {
      body: ids,
    });
  }

  changeActive(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(API.USERS.CHANGE_ACTIVE(id), active);
  }

  activateAccount(token: string, password: string): Observable<void> {
    return this.http.post<void>(
      API.USERS.ACTIVATE,
      { password },
      { params: { token } },
    );
  }
}
