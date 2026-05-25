import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Profile } from 'src/app/core/models/Profile';
import { UserSessionService } from '../../services/user-session.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  photoPreviewUrl?: SafeUrl;
  profile: Profile = new Profile();

  private objectUrl?: string;
  private subs: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private userSessionService: UserSessionService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.userSessionService.loadSession();

    this.subscribeToProfile();
    this.subscribeToPhoto();
  }

  ngOnDestroy(): void {
    this.cleanupObjectUrl();
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  logout(): void {
    this.userSessionService.clear();
    this.authService.logout();

    this.messageService.add({
      severity: 'success',
      detail: 'Usuário deslogado com sucesso.',
    });

    this.router.navigate(['/auth/login']);
  }

  private subscribeToProfile(): void {
    const sub = this.userSessionService.profile$.subscribe((profile) => {
      if (!profile) {
        this.profile = new Profile();
        return;
      }

      const firstName = profile.name ? profile.name.trim().split(' ')[0] : '';

      this.profile = {
        ...profile,
        name: firstName,
      };
    });

    this.subs.push(sub);
  }

  private subscribeToPhoto(): void {
    const sub = this.userSessionService.photo$.subscribe((blob) => {
      if (!blob || blob.size === 0) {
        this.cleanupObjectUrl();
        this.photoPreviewUrl = undefined;
        return;
      }

      this.cleanupObjectUrl();

      this.objectUrl = URL.createObjectURL(blob);

      this.photoPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
        this.objectUrl,
      );
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
