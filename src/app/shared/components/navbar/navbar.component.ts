import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { UserSessionService } from '../../services/user-session.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, EMPTY, Subscription } from 'rxjs';
import { Profile } from 'src/app/core/models/Profile';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  photoPreviewUrl?: SafeUrl;
  private objectUrl?: string;

  profile: Profile = new Profile();

  private subs: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private userSessionService: UserSessionService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.loadMyPhoto();
    this.loadProfile();
  }

  ngOnDestroy(): void {
    this.cleanupObjectUrl();
    this.subs.forEach((s) => s.unsubscribe());
  }

  logout(): void {
    this.authService.logout();
    this.messageService.add({
      severity: 'success',
      detail: 'Usuário deslogado com sucesso.',
    });
    this.router.navigate(['/auth/login']);
  }

private loadMyPhoto(): void {
  const sub = this.userSessionService
    .getMyPhoto()
    .pipe(
      catchError(() => {
        // Não tem foto → comportamento normal
        this.photoPreviewUrl = undefined;
        return EMPTY;
      })
    )
    .subscribe((blob) => {
      if (!blob || blob.size === 0) return;

      this.cleanupObjectUrl();
      this.objectUrl = URL.createObjectURL(blob);
      this.photoPreviewUrl =
        this.sanitizer.bypassSecurityTrustUrl(this.objectUrl);
    });

  this.subs.push(sub);
}

  private loadProfile(): void {
    const sub = this.userSessionService.getMe().subscribe({
      next: (data) => {
        console.log(data);

        const firstName = data.name ? data.name.trim().split(' ')[0] : '';

        this.profile = {
          ...this.profile,
          ...data,
          name: firstName,
        };
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar perfil.',
        });
      },
    });

    this.subs.push(sub);
  }

  private cleanupObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined;
    }
  }
}
