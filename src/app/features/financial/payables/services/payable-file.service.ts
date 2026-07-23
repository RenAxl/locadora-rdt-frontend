import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API } from 'src/app/core/config/api.config';

import { PayableFile } from '../models/PayableFile';

@Injectable({
  providedIn: 'root',
})
export class PayableFileService {
  constructor(private http: HttpClient) {}

  findAllByPayable(payableId: number): Observable<PayableFile[]> {
    return this.http
      .get<any[]>(API.PAYABLES.FILES.ROOT(payableId))
      .pipe(map((response) => response.map((item) => new PayableFile(item))));
  }

  getViewBlob(payableId: number, fileId: number): Observable<Blob> {
    return this.http.get(API.PAYABLES.FILES.VIEW(payableId, fileId), {
      responseType: 'blob',
    });
  }

  upload(
    payableId: number,
    name: string,
    file: File,
  ): Observable<PayableFile> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    return this.http
      .post<any>(API.PAYABLES.FILES.ROOT(payableId), formData)
      .pipe(map((response) => new PayableFile(response)));
  }

  delete(payableId: number, fileId: number): Observable<void> {
    return this.http.delete<void>(
      API.PAYABLES.FILES.BY_ID(payableId, fileId),
    );
  }

  download(
    payableId: number,
    fileId: number,
  ): Observable<HttpResponse<Blob>> {
    return this.http.get(API.PAYABLES.FILES.DOWNLOAD(payableId, fileId), {
      observe: 'response',
      responseType: 'blob',
    });
  }
}
