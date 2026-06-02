import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, EMPTY, Subscription } from 'rxjs';
import { Supplier } from '../../models/Supplier';
import { SupplierService } from '../../services/supplier.service';

@Component({ selector: 'app-supplier-details-modal', templateUrl: './supplier-details-modal.component.html', styleUrls: ['./supplier-details-modal.component.css'] })
export class SupplierDetailsModalComponent implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() supplier: Supplier | null = null;
  imagePreviewUrl?: SafeUrl;
  private objectUrl?: string;
  private subscription?: Subscription;

  constructor(private service: SupplierService, private sanitizer: DomSanitizer) {}
  ngOnChanges(): void { this.visible ? this.loadImage() : this.cleanup(); }
  ngOnDestroy(): void { this.cleanup(); }
  close(): void { this.visibleChange.emit(false); this.cleanup(); }

  private loadImage(): void {
    if (!this.supplier?.id) return;
    this.subscription?.unsubscribe();
    this.subscription = this.service.getImage(this.supplier.id).pipe(catchError(() => EMPTY)).subscribe((blob) => {
      if (!blob || blob.size === 0) return;
      this.cleanupObjectUrl();
      this.objectUrl = URL.createObjectURL(blob);
      this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(this.objectUrl);
    });
  }
  private cleanup(): void { this.subscription?.unsubscribe(); this.subscription = undefined; this.imagePreviewUrl = undefined; this.cleanupObjectUrl(); }
  private cleanupObjectUrl(): void { if (this.objectUrl) URL.revokeObjectURL(this.objectUrl); this.objectUrl = undefined; }
}
