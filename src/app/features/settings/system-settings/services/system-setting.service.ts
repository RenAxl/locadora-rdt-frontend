import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { SystemSetting } from '../models/system-setting';

@Injectable({ providedIn: 'root' })
export class SystemSettingService {
  constructor(private http: HttpClient) {}

  findCurrent(): Observable<SystemSetting> {
    return this.http.get<SystemSetting>(API.SYSTEM_SETTINGS.ROOT);
  }

  update(setting: SystemSetting): Observable<SystemSetting> {
    return this.http.put<SystemSetting>(API.SYSTEM_SETTINGS.ROOT, setting);
  }
}
