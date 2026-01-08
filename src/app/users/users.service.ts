import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { AppConstants } from '../app-constant';
import { Pagination } from '../core/models/Pagination';
import { User } from '../core/models/User';

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

    return this.http.get<any>(AppConstants.backendServer + 'users', { params });
  }

  insert(user: User): Observable<any> {
    return this.http.post<any>(AppConstants.backendServer + 'users', user);
  }

  findById(id: any): Observable<any> {
    return this.http.get<any>(AppConstants.backendServer + 'users/' + id);
  }

  update(user: User): Observable<any> {
    console.log(user);
    return this.http.put<any>(
      AppConstants.backendServer + 'users/' + user.id,
      user
    );
  }

  delete(id: Number): Observable<any> {
    return this.http.delete(AppConstants.backendServer + 'users/' + id);
  }

  deleteAll(ids: number[]): Observable<void> {
  return this.http.delete<void>(AppConstants.backendServer + 'users/all', {
    body: ids,
  });
}

changeActive(id: number, active: boolean): Observable<any> {
  return this.http.patch(
    AppConstants.backendServer + 'users/' + id + '/active',
    active
  );
}
  
}
