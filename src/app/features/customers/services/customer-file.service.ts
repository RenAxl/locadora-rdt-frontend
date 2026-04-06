import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CustomerFile } from '../models/CustomerFile';
import { API } from 'src/app/core/config/api.config';



@Injectable({
  providedIn: 'root'
})
export class CustomerFileService {

  constructor(private http: HttpClient) {}

  upload(customerId: number, name: string, file: File): Observable<CustomerFile> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    return this.http
      .post<CustomerFile>(API.CUSTOMERS.FILES.ROOT(customerId), formData)
      .pipe(
        map(response => new CustomerFile(response))
      );
  }
}