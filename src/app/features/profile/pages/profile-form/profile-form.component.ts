import { Component, OnDestroy, OnInit } from '@angular/core';
import { Profile } from '../../../../core/models/Profile';
import { ChangePassword } from '../../models/ChangePassword';
import { ProfileService } from '../../services/profile.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { PhotoPreview } from 'src/app/core/utils/photo-preview.util';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css'],
})
export class ProfileFormComponent implements OnInit, OnDestroy {
  profile: Profile = new Profile();
  password: ChangePassword = new ChangePassword();

  selectedPhoto?: File;
  selectedPhotoName?: string;

  photoPreviewUrl?: SafeUrl;

  private subs: Subscription[] = [];
  private photoPreview: PhotoPreview;

  constructor(
    private profileService: ProfileService,
    private messageService: MessageService,
    private router: Router,
    sanitizer: DomSanitizer,
  ) {
    this.photoPreview = new PhotoPreview(sanitizer);
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadMyPhoto();
  }

  ngOnDestroy(): void {
    this.photoPreview.clear();
    this.subs.forEach((s) => s.unsubscribe());
  }

  private loadProfile(): void {
    const sub = this.profileService.getMe().subscribe({
      next: (data) => {
        this.profile = { ...this.profile, ...data };
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

  private loadMyPhoto(): void {
    const sub = this.profileService.getMyPhoto().subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) return;

        this.photoPreviewUrl = this.photoPreview.create(blob) ?? undefined;
      },
      error: () => {},
    });

    this.subs.push(sub);
  }

  onPhotoSelected(event: any): void {
    const file: File | undefined = event?.target?.files?.[0];
    this.selectedPhoto = file;
    this.selectedPhotoName = file?.name;

    this.photoPreviewUrl = file ? this.photoPreview.create(file) ?? undefined : undefined;
  }

  private wantsToChangePassword(): boolean {
    return !!this.password?.newPassword?.trim();
  }

  private validatePasswordChangeOrToast(): boolean {
    if (!this.wantsToChangePassword()) {
      return true;
    }

    if (!this.password.currentPassword?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Para alterar a senha, informe a senha atual.',
      });
      return false;
    }

    if ((this.password.newPassword || '').length < 6) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'A nova senha deve ter no mínimo 6 caracteres.',
      });
      return false;
    }

    if (this.password.newPassword !== this.password.confirmPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'A confirmação de senha deve ser igual à nova senha.',
      });
      return false;
    }

    return true;
  }

  saveProfile(): void {
    if (!this.validatePasswordChangeOrToast()) {
      return;
    }

    const sub = this.profileService.updateMe(this.profile).subscribe({
      next: () => {
        if (this.wantsToChangePassword()) {
          this.changePassword();
          return;
        }

        this.uploadPhotoOrFinish();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.message || 'Erro ao atualizar perfil.',
        });
      },
    });

    this.subs.push(sub);
  }

  private changePassword(): void {
    const sub = this.profileService.changePassword(this.password).subscribe({
      next: () => this.uploadPhotoOrFinish(),
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.message || 'Erro ao alterar a senha.',
        });
      },
    });

    this.subs.push(sub);
  }

  private uploadPhotoOrFinish(): void {
    if (!this.selectedPhoto) {
      this.finishSuccessAndRedirect('Perfil atualizado com sucesso!');
      return;
    }

    const sub = this.profileService.updateMyPhoto(this.selectedPhoto).subscribe({
      next: () => this.finishSuccessAndRedirect('Perfil atualizado com sucesso!'),
      error: (err) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Atenção',
          detail:
            err?.error?.message ||
            'Perfil atualizado, mas falhou ao enviar a foto.',
        });
        this.router.navigate(['/home']);
      },
    });

    this.subs.push(sub);
  }

  private finishSuccessAndRedirect(detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail,
    });

    this.password = new ChangePassword();

    this.router.navigate(['/home']);
  }
}
