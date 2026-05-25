import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API } from 'src/app/core/config/api.config';
import { Profile } from 'src/app/core/models/Profile';

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  private profileSubject = new BehaviorSubject<Profile | null>(null);
  profile$ = this.profileSubject.asObservable();

  private photoSubject = new BehaviorSubject<Blob | null>(null);
  photo$ = this.photoSubject.asObservable();

  private loaded = false;

  constructor(private http: HttpClient) {}

  loadSession(): void {
    if (this.loaded) {
      return;
    }

    this.loaded = true;

    this.loadProfile();
    this.loadPhoto();
  }

  refreshSession(): void {
    this.loaded = false;
    this.loadSession();
  }

  clear(): void {
    this.loaded = false;
    this.profileSubject.next(null);
    this.photoSubject.next(null);
  }

  getProfileValue(): Profile | null {
    return this.profileSubject.value;
  }

  private loadProfile(): void {
    this.getMe()
      .pipe(
        tap((profile) => this.profileSubject.next(profile)),
        catchError(() => {
          this.profileSubject.next(null);
          return EMPTY;
        })
      )
      .subscribe();
  }

  private loadPhoto(): void {
    this.getMyPhoto()
      .pipe(
        tap((photo) => {
          if (!photo || photo.size === 0) {
            this.photoSubject.next(null);
            return;
          }

          this.photoSubject.next(photo);
        }),
        catchError(() => {
          this.photoSubject.next(null);
          return EMPTY;
        })
      )
      .subscribe();
  }

  getMyPhoto(): Observable<Blob> {
    return this.http.get(`${API.USERS.ROOT}/me/photo`, {
      responseType: 'blob',
    });
  }

  getMe(): Observable<Profile> {
    return this.http.get<Profile>(`${API.USERS.ROOT}/me`);
  }
}