import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { User } from '../models/user';
import { API } from 'src/app/core/config/api.config';
import { UserDTO } from '../dtos/user.dto';
import { PageResponse } from 'src/app/core/models/page-response';
import { UserInsertDTO } from '../dtos/user-insert.dto';
import { UserDetailsDTO } from '../dtos/user-details.dto';
import { UserUpdateDTO } from '../dtos/user-update.dto';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<UserDTO>> {
    let params = new HttpParams()
      .set('name', filterName)
      .set('page', pagination.page)
      .set('linesPerPage', pagination.linesPerPage)
      .set('direction', String(pagination.direction))
      .set('orderBy', String(pagination.orderBy));

    return this.http.get<PageResponse<UserDTO>>(API.USERS.ROOT, { params });
  }

  insert(user: UserInsertDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(API.USERS.ROOT, user);
  }

  findById(id: any): Observable<UserDetailsDTO> {
    return this.http.get<UserDetailsDTO>(API.USERS.BY_ID(id));
  }

  update(dto: UserUpdateDTO): Observable<UserDTO> {
    if (!dto.id) {
      throw new Error('User ID is required for update');
    }
    return this.http.put<UserDTO>(API.USERS.BY_ID(dto.id), dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.USERS.BY_ID(id));
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

  getUserPhoto(id: number): Observable<Blob> {
    return this.http.get(API.USERS.PHOTO(id), {
      responseType: 'blob',
    });
  }
}
