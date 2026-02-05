import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { BACKEND_SERVER } from 'src/app/core/constants/api.constants';
import { User } from '../../../core/models/User';


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

    return this.http.get<any>(BACKEND_SERVER + 'users', { params });
  }

  insert(user: User): Observable<any> {
    return this.http.post<any>(BACKEND_SERVER + 'users', user);
  }

  findById(id: any): Observable<any> {
    return this.http.get<any>(BACKEND_SERVER + 'users/' + id);
  }

  update(user: User): Observable<any> {
    console.log(user);
    return this.http.put<any>(
      BACKEND_SERVER + 'users/' + user.id,
      user,
    );
  }

  delete(id: Number): Observable<any> {
    return this.http.delete(BACKEND_SERVER + 'users/' + id);
  }

  deleteAll(ids: number[]): Observable<void> {
    return this.http.delete<void>(BACKEND_SERVER + 'users/all', {
      body: ids,
    });
  }

  changeActive(id: number, active: boolean): Observable<any> {
    return this.http.patch(
      BACKEND_SERVER + 'users/' + id + '/active',
      active,
    );
  }

  activateAccount(token: string, password: string): Observable<void> {
  return this.http.post<void>(
    `${BACKEND_SERVER}users/activate`,
    { password },
    { params: { token } }
  );
}

}
