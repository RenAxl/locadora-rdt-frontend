import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, EMPTY, Subscription } from 'rxjs';

import { Category } from '../../models/Category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-details-modal',
  templateUrl: './category-details-modal.component.html',
  styleUrls: ['./category-details-modal.component.css'],
})
export class CategoryDetailsModalComponent implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento da Categoria';
  @Input() category: Category | null = null;

  imagePreviewUrl?: SafeUrl;
  private objectUrl?: string;
  private sub?: Subscription;

  constructor(
    private categoryService: CategoryService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const categoryChanged = !!changes['category'];
    const visibleChanged = !!changes['visible'];

    if ((categoryChanged || visibleChanged) && this.visible) {
      this.loadCategoryImage();
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
    if (active === undefined || active === null) {
      return '-';
    }

    return active ? 'Sim' : 'Não';
  }

  onImgError(): void {
    this.imagePreviewUrl = undefined;
    this.cleanupObjectUrl();
  }

  private loadCategoryImage(): void {
    const id = this.category?.id;
    if (!id) {
      this.imagePreviewUrl = undefined;
      this.cleanupObjectUrl();
      return;
    }

    this.sub?.unsubscribe();

    this.sub = this.categoryService
      .getCategoryImage(id)
      .pipe(
        catchError(() => {
          this.imagePreviewUrl = undefined;
          this.cleanupObjectUrl();
          return EMPTY;
        }),
      )
      .subscribe((blob: Blob) => {
        if (!blob || blob.size === 0) {
          this.imagePreviewUrl = undefined;
          this.cleanupObjectUrl();
          return;
        }

        this.cleanupObjectUrl();
        this.objectUrl = URL.createObjectURL(blob);
        this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
          this.objectUrl,
        );
      });
  }

  private cleanup(): void {
    this.sub?.unsubscribe();
    this.sub = undefined;
    this.imagePreviewUrl = undefined;
    this.cleanupObjectUrl();
  }

  private cleanupObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined;
    }
  }
}
