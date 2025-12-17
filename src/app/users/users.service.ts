import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { AppConstants } from '../app-constant';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

    list(): Observable<any> {

 
    return this.http.get<any>(AppConstants.backendServer + 'users');
  }

}
