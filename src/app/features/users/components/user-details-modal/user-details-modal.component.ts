import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, EMPTY, Subscription } from 'rxjs';

import { User } from 'src/app/core/models/User';
import { UsersService } from 'src/app/features/users/services/users.service';

@Component({
  selector: 'app-user-details-modal',
  templateUrl: './user-details-modal.component.html',
  styleUrls: ['./user-details-modal.component.css'],
})
export class UserDetailsModalComponent implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento do Usuário';
  @Input() user: User | null = null;

  photoPreviewUrl?: SafeUrl;
  private objectUrl?: string;
  private sub?: Subscription;

  constructor(
    private usersService: UsersService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const userChanged = !!changes['user'];
    const visibleChanged = !!changes['visible'];

    if ((userChanged || visibleChanged) && this.visible) {
      this.loadUserPhoto();
    }

    if (visibleChanged && !this.visible) {
      this.cleanup();
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  close(): void {
    this.visibleChange.emit(false);
    this.cleanup();
  }

  getActiveLabel(active?: boolean): string {
    if (active === undefined || active === null) return '-';
    return active ? 'Sim' : 'Não';
  }

  onImgError(): void {
    this.photoPreviewUrl = undefined;
    this.cleanupObjectUrl();
  }

  private loadUserPhoto(): void {
    const id = this.user?.id;
    if (!id) {
      this.photoPreviewUrl = undefined;
      this.cleanupObjectUrl();
      return;
    }

    this.sub?.unsubscribe();

    this.sub = this.usersService
      .getUserPhoto(id)
      .pipe(
        catchError(() => {
          this.photoPreviewUrl = undefined;
          this.cleanupObjectUrl();
          return EMPTY;
        })
      )
      .subscribe((blob: Blob) => {
        if (!blob || blob.size === 0) {
          this.photoPreviewUrl = undefined;
          this.cleanupObjectUrl();
          return;
        }

        this.cleanupObjectUrl();
        this.objectUrl = URL.createObjectURL(blob);
        this.photoPreviewUrl =
          this.sanitizer.bypassSecurityTrustUrl(this.objectUrl);
      });
  }

  private cleanup(): void {
    this.sub?.unsubscribe();
    this.sub = undefined;
    this.photoPreviewUrl = undefined;
    this.cleanupObjectUrl();
  }

  private cleanupObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined;
    }
  }
}