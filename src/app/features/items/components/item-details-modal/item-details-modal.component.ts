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

import { Item } from '../../models/Item';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item-details-modal',
  templateUrl: './item-details-modal.component.html',
  styleUrls: ['./item-details-modal.component.css'],
})
export class ItemDetailsModalComponent implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento do Item';
  @Input() item: Item | null = null;

  imagePreviewUrl?: SafeUrl;
  private objectUrl?: string;
  private sub?: Subscription;

  constructor(
    private itemService: ItemService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const itemChanged = !!changes['item'];
    const visibleChanged = !!changes['visible'];

    if ((itemChanged || visibleChanged) && this.visible) {
      this.loadItemImage();
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

  private loadItemImage(): void {
    const id = this.item?.id;
    if (!id) {
      this.imagePreviewUrl = undefined;
      this.cleanupObjectUrl();
      return;
    }

    this.sub?.unsubscribe();

    this.sub = this.itemService
      .getItemImage(id)
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
