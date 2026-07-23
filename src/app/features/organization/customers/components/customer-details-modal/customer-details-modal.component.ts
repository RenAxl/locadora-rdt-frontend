import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/Customer';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, EMPTY, Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-details-modal',
  templateUrl: './customer-details-modal.component.html',
  styleUrls: ['./customer-details-modal.component.css']
})
export class CustomerDetailsModalComponent implements OnChanges, OnDestroy {

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento do Cliente';
  @Input() customer: Customer | null = null;

  photoPreviewUrl?: SafeUrl;
  private objectUrl?: string;
  private sub?: Subscription;

  constructor(
    private customerService: CustomerService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const customerChanged = !!changes['customer'];
    const visibleChanged = !!changes['visible'];

    if ((customerChanged || visibleChanged) && this.visible) {
      this.loadCustomerPhoto();
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

  private loadCustomerPhoto(): void {
    const id = this.customer?.id;
    if (!id) {
      this.photoPreviewUrl = undefined;
      this.cleanupObjectUrl();
      return;
    }

    this.sub?.unsubscribe();

    this.sub = this.customerService
      .getCustomerPhoto(id)
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
