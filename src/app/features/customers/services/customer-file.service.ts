import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CustomerFile } from '../models/CustomerFile';
import { API } from 'src/app/core/config/api.config';

@Injectable({
  providedIn: 'root',
})
export class CustomerFileService {
  constructor(private http: HttpClient) {}

  findAllByCustomer(customerId: number): Observable<CustomerFile[]> {
    return this.http
      .get<any[]>(API.CUSTOMERS.FILES.ROOT(customerId))
      .pipe(map((response) => response.map((item) => new CustomerFile(item))));
  }

  getViewBlob(customerId: number, fileId: number): Observable<Blob> {
    return this.http.get(API.CUSTOMERS.FILES.VIEW(customerId, fileId), {
      responseType: 'blob',
    });
  }

  upload(
    customerId: number,
    name: string,
    file: File,
  ): Observable<CustomerFile> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    return this.http
      .post<any>(API.CUSTOMERS.FILES.ROOT(customerId), formData)
      .pipe(map((response) => new CustomerFile(response)));
  }

  delete(customerId: number, fileId: number): Observable<void> {
    return this.http.delete<void>(
      API.CUSTOMERS.FILES.BY_ID(customerId, fileId),
    );
  }
}
