import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { PageResponse } from 'src/app/core/models/page-response';
import { SupplierDTO } from '../dtos/supplier.dto';
import { SupplierDetailsDTO } from '../dtos/supplier-details.dto';
import { SupplierInsertDTO } from '../dtos/supplier-insert.dto';
import { SupplierUpdateDTO } from '../dtos/supplier-update.dto';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  constructor(private http: HttpClient) {}

  list(pagination: Pagination, filterName: string): Observable<PageResponse<SupplierDTO>> {
    const params = new HttpParams()
      .set('name', filterName)
      .set('page', pagination.page)
      .set('linesPerPage', pagination.linesPerPage)
      .set('direction', String(pagination.direction))
      .set('orderBy', String(pagination.orderBy));
    return this.http.get<PageResponse<SupplierDTO>>(API.SUPPLIERS.ROOT, { params });
  }

  insert(dto: SupplierInsertDTO): Observable<SupplierDTO> {
    return this.http.post<SupplierDTO>(API.SUPPLIERS.ROOT, dto);
  }

  findById(id: number | string): Observable<SupplierDetailsDTO> {
    return this.http.get<SupplierDetailsDTO>(API.SUPPLIERS.BY_ID(id));
  }

  update(dto: SupplierUpdateDTO): Observable<SupplierDTO> {
    return this.http.put<SupplierDTO>(API.SUPPLIERS.BY_ID(dto.id), dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.SUPPLIERS.BY_ID(id));
  }

  updateImage(id: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put<void>(API.SUPPLIERS.IMAGE(id), formData);
  }

  getImage(id: number): Observable<Blob | null> {
    return this.http.get(API.SUPPLIERS.IMAGE(id), { responseType: 'blob' });
  }
}
