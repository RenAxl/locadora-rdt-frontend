import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../models/Customer';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CustomerMapper } from '../../mapper/customer.mapper';
import { PhotoPreview } from 'src/app/core/utils/photo-preview.util';

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

  private subs: Subscription[] = [];
  private photoPreview: PhotoPreview;

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    sanitizer: DomSanitizer,
  ) {
    this.photoPreview = new PhotoPreview(sanitizer);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('customerId');

    if (id != null) {
      const sub = this.customerService.findById(id).subscribe({
        next: (data) => {
          this.customer = CustomerMapper.fromDetailsDTO(data);
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
    this.photoPreview.clear();
    this.subs.forEach((s) => s.unsubscribe());
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.customer.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const dto = CustomerMapper.toInsertDTO(this.customer);

    const sub = this.customerService.insert(dto).subscribe({
      next: (createdCustomer) => {
        this.uploadPhotoOrFinish(
          createdCustomer.id,
          'Cliente cadastrado com sucesso!',
          'Cliente cadastrado, mas falhou ao enviar a foto.',
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
    if (!this.customer.id) {
      return;
    }

    const dto = CustomerMapper.toUpdateDTO(this.customer);

    const sub = this.customerService.update(dto).subscribe({
      next: () => {
        this.uploadPhotoOrFinish(
          this.customer.id,
          'Cliente atualizado com sucesso!',
          'Cliente atualizado, mas falhou ao enviar a foto.',
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
    this.selectedPhotoName = undefined;
    this.photoPreviewUrl = null;

    this.router.navigate(['/customers']);
  }

  private loadCustomerPhoto(customerId: number): void {
    const sub = this.customerService.getCustomerPhoto(customerId).subscribe({
      next: (blob) => {
        this.photoPreviewUrl = this.photoPreview.create(blob);
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
    this.selectedPhotoName = file?.name ?? undefined;

    this.photoPreviewUrl = file ? this.photoPreview.create(file) : null;
  }

  private uploadPhotoOrFinish(
    customerId: number | undefined,
    successMessage: string,
    uploadErrorMessage: string,
  ): void {
    if (!customerId || !this.selectedPhoto) {
      this.finishCustomerSuccessAndRedirect(successMessage);
      return;
    }

    const sub = this.customerService
      .updatePhoto(customerId, this.selectedPhoto)
      .subscribe({
        next: () => this.finishCustomerSuccessAndRedirect(successMessage),
        error: (err) => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Atenção',
            detail: err?.error?.message || uploadErrorMessage,
          });

          this.router.navigate(['/customers']);
        },
      });

    this.subs.push(sub);
  }
}
