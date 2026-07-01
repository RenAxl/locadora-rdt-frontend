import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API } from 'src/app/core/config/api.config';

import { ReceivableFile } from '../models/ReceivableFile';

@Injectable({
  providedIn: 'root',
})
export class ReceivableFileService {
  constructor(private http: HttpClient) {}

  findAllByReceivable(receivableId: number): Observable<ReceivableFile[]> {
    return this.http
      .get<any[]>(API.RECEIVABLES.FILES.ROOT(receivableId))
      .pipe(map((response) => response.map((item) => new ReceivableFile(item))));
  }

  getViewBlob(receivableId: number, fileId: number): Observable<Blob> {
    return this.http.get(API.RECEIVABLES.FILES.VIEW(receivableId, fileId), {
      responseType: 'blob',
    });
  }

  upload(
    receivableId: number,
    name: string,
    file: File,
  ): Observable<ReceivableFile> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    return this.http
      .post<any>(API.RECEIVABLES.FILES.ROOT(receivableId), formData)
      .pipe(map((response) => new ReceivableFile(response)));
  }

  delete(receivableId: number, fileId: number): Observable<void> {
    return this.http.delete<void>(
      API.RECEIVABLES.FILES.BY_ID(receivableId, fileId),
    );
  }

  download(
    receivableId: number,
    fileId: number,
  ): Observable<HttpResponse<Blob>> {
    return this.http.get(API.RECEIVABLES.FILES.DOWNLOAD(receivableId, fileId), {
      observe: 'response',
      responseType: 'blob',
    });
  }
}
