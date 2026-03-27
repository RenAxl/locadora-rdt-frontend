import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../models/Customer';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
})
export class CustomerFormComponent implements OnInit, OnDestroy {
  customer: Customer = new Customer();

  selectedPhoto: File | null = null;
  selectedPhotoName?: string;
  photoPreviewUrl: SafeUrl | null = null;

  private objectUrl?: string;

  private subs: Subscription[] = [];

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('customerId');

    if (id != null) {
      const sub = this.customerService.findById(id).subscribe({
        next: (data) => {
          this.customer = data;
          this.loadCustomerPhoto(Number(id));
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err?.error?.message || 'Erro ao carregar cliente.',
          });
        },
      });

      this.subs.push(sub);
    }
  }

  ngOnDestroy(): void {
    this.cleanupObjectUrl();
    this.subs.forEach((s) => s.unsubscribe());
  }

  save(form: NgForm) {
    if (this.customer.id != null && this.customer.id.toString().trim() !== '') {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const sub = this.customerService.insert(this.customer).subscribe({
      next: (createdCustomer) => {
        if (this.selectedPhoto) {
          const subPhoto = this.customerService
            .updatePhoto(createdCustomer.id!, this.selectedPhoto)
            .subscribe({
              next: () => {
                this.finishCustomerSuccessAndRedirect(
                  'Cliente cadastrado com sucesso!',
                );
              },
              error: (err) => {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Atenção',
                  detail:
                    err?.error?.message ||
                    'Cliente cadastrado, mas falhou ao enviar a foto.',
                });

                this.router.navigate(['/customers']);
              },
            });

          this.subs.push(subPhoto);
          return;
        }

        this.finishCustomerSuccessAndRedirect(
          'Cliente cadastrado com sucesso!',
        );
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.message || 'Erro ao cadastrar cliente.',
        });
      },
    });

    this.subs.push(sub);
  }

  update(): void {
    const sub = this.customerService.update(this.customer).subscribe({
      next: () => {
        if (this.selectedPhoto) {
          const subPhoto = this.customerService
            .updatePhoto(this.customer.id!, this.selectedPhoto)
            .subscribe({
              next: () => {
                this.finishCustomerSuccessAndRedirect(
                  'Cliente atualizado com sucesso!',
                );
              },
              error: (err) => {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Atenção',
                  detail:
                    err?.error?.message ||
                    'Cliente atualizado, mas falhou ao enviar a foto.',
                });

                this.router.navigate(['/customers/']);
              },
            });

          this.subs.push(subPhoto);
          return;
        }

        this.finishCustomerSuccessAndRedirect(
          'Cliente atualizado com sucesso!',
        );
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.message || 'Erro ao atualizar cliente.',
        });
      },
    });

    this.subs.push(sub);
  }

  private finishCustomerSuccessAndRedirect(detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail,
    });

    this.customer = new Customer();
    this.selectedPhoto = null;
    this.photoPreviewUrl = null;

    this.router.navigate(['/customers']);
  }

  private cleanupObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined;
    }
  }

  private loadCustomerPhoto(customerId: number): void {
    const sub = this.customerService.getCustomerPhoto(customerId).subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) return;

        this.cleanupObjectUrl();
        this.objectUrl = URL.createObjectURL(blob);
        this.photoPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
          this.objectUrl,
        );
      },
      error: () => {
        this.photoPreviewUrl = null;
      },
    });

    this.subs.push(sub);
  }

  onPhotoSelected(event: any): void {
    const file = event?.target?.files?.[0] ?? null;

    this.selectedPhoto = file;
    this.selectedPhotoName = file?.name ?? null;

    if (file) {
      this.cleanupObjectUrl();
      this.objectUrl = URL.createObjectURL(file);
      this.photoPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
        this.objectUrl,
      );
    }
  }
}
