import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SupplierMapper } from '../../mapper/supplier.mapper';
import { Supplier } from '../../models/Supplier';
import { SupplierService } from '../../services/supplier.service';

@Component({ selector: 'app-supplier-form', templateUrl: './supplier-form.component.html', styleUrls: ['./supplier-form.component.css'] })
export class SupplierFormComponent implements OnInit, OnDestroy {
  supplier = new Supplier();
  selectedImage: File | null = null;
  selectedImageName?: string;
  imagePreviewUrl: SafeUrl | null = null;
  private objectUrl?: string;
  private subscriptions: Subscription[] = [];

  constructor(private service: SupplierService, private messages: MessageService, private router: Router,
    private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('supplierId');
    if (!id) return;
    this.subscriptions.push(this.service.findById(id).subscribe({
      next: (dto) => { this.supplier = SupplierMapper.fromDetailsDTO(dto); this.loadImage(Number(id)); },
      error: (err) => this.showError(err, 'Erro ao carregar fornecedor.'),
    }));
  }

  ngOnDestroy(): void { this.cleanupObjectUrl(); this.subscriptions.forEach((sub) => sub.unsubscribe()); }

  save(form: NgForm): void {
    if (form.invalid) { form.control.markAllAsTouched(); return; }
    this.supplier.id ? this.update() : this.insert();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedImage = input.files?.[0] ?? null;
    this.selectedImageName = this.selectedImage?.name;
    this.cleanupObjectUrl();
    if (!this.selectedImage) { this.imagePreviewUrl = null; return; }
    this.objectUrl = URL.createObjectURL(this.selectedImage);
    this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(this.objectUrl);
  }

  private insert(): void {
    this.subscriptions.push(this.service.insert(SupplierMapper.toInsertDTO(this.supplier)).subscribe({
      next: (created) => this.uploadImageOrFinish(created.id!, 'Fornecedor cadastrado com sucesso!'),
      error: (err) => this.showError(err, 'Erro ao cadastrar fornecedor.'),
    }));
  }

  private update(): void {
    this.subscriptions.push(this.service.update(SupplierMapper.toUpdateDTO(this.supplier)).subscribe({
      next: () => this.uploadImageOrFinish(this.supplier.id!, 'Fornecedor atualizado com sucesso!'),
      error: (err) => this.showError(err, 'Erro ao atualizar fornecedor.'),
    }));
  }

  private uploadImageOrFinish(id: number, successMessage: string): void {
    if (!this.selectedImage) { this.finish(successMessage); return; }
    this.subscriptions.push(this.service.updateImage(id, this.selectedImage).subscribe({
      next: () => this.finish(successMessage),
      error: () => { this.messages.add({ severity: 'warn', detail: 'Fornecedor salvo, mas falhou ao enviar a imagem.' }); this.router.navigate(['/suppliers']); },
    }));
  }

  private loadImage(id: number): void {
    this.subscriptions.push(this.service.getImage(id).subscribe({
      next: (blob) => { if (!blob || blob.size === 0) return; this.cleanupObjectUrl(); this.objectUrl = URL.createObjectURL(blob); this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(this.objectUrl); },
      error: () => { this.imagePreviewUrl = null; },
    }));
  }

  private finish(detail: string): void { this.messages.add({ severity: 'success', detail }); this.router.navigate(['/suppliers']); }
  private showError(err: any, fallback: string): void { this.messages.add({ severity: 'error', detail: err?.error?.message || fallback }); }
  private cleanupObjectUrl(): void { if (this.objectUrl) URL.revokeObjectURL(this.objectUrl); this.objectUrl = undefined; }
}
