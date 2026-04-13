import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { Position } from '../models/Position';

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  constructor(private http: HttpClient) {}

  list(pagination: Pagination, filterName: string): Observable<any> {
    let params = new HttpParams()
      .set('name', filterName)
      .set('page', pagination.page)
      .set('linesPerPage', pagination.linesPerPage)
      .set('direction', String(pagination.direction))
      .set('orderBy', String(pagination.orderBy));

    return this.http.get<any>(API.POSITIONS.ROOT, { params });
  }

  insert(position: Position): Observable<any> {
    return this.http.post<any>(API.POSITIONS.ROOT, position);
  }

  findById(id: number | string): Observable<any> {
    return this.http.get<any>(API.POSITIONS.BY_ID(id));
  }

  update(position: Position): Observable<any> {
    if (!position.id) {
      throw new Error('ID do usuário obrigatório para atualização.');
    }

    return this.http.put<Position>(API.POSITIONS.BY_ID(position.id), position);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(API.POSITIONS.BY_ID(id));
  }
}
