import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CustomerFileService } from '../../services/customer-file.service';
import { CustomerFile } from '../../models/CustomerFile';


@Component({
  selector: 'app-customer-files-modal',
  templateUrl: './customer-files-modal.component.html',
  styleUrls: ['./customer-files-modal.component.css']
})
export class CustomerFilesModalComponent implements OnDestroy {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() customerId?: number;
  @Input() customerName?: string;

  fileName: string = '';
  selectedFile: File | null = null;
  selectedFileName: string = '';
  previewUrl: SafeUrl | null = null;
  isImagePreview: boolean = false;

  private objectUrl?: string;

  constructor(
    private customerFileService: CustomerFileService,
    private sanitizer: DomSanitizer
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.clearPreview();
      this.selectedFile = null;
      this.selectedFileName = '';
      return;
    }

    const file = input.files[0];
    this.selectedFile = file;
    this.selectedFileName = file.name;

    if (!this.fileName || !this.fileName.trim()) {
      this.fileName = file.name;
    }

    this.createPreview(file);
  }

  upload(): void {
    if (!this.customerId) {
      console.error('customerId não informado.');
      return;
    }

    if (!this.fileName || !this.fileName.trim()) {
      console.error('Nome do arquivo é obrigatório.');
      return;
    }

    if (!this.selectedFile) {
      console.error('Arquivo não selecionado.');
      return;
    }

    this.customerFileService
      .upload(this.customerId, this.fileName.trim(), this.selectedFile)
      .subscribe({
        next: (response: CustomerFile) => {
          console.log('Arquivo enviado com sucesso:', response);
          this.clearForm();
        },
        error: (error) => {
          console.error('Erro ao enviar arquivo:', error);
        }
      });
  }

  clearForm(): void {
    this.fileName = '';
    this.selectedFile = null;
    this.selectedFileName = '';
    this.clearPreview();
  }

  ngOnDestroy(): void {
    this.clearPreview();
  }

  private createPreview(file: File): void {
    this.clearPreview();

    this.isImagePreview = file.type.startsWith('image/');

    if (this.isImagePreview) {
      this.objectUrl = URL.createObjectURL(file);
      this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(this.objectUrl);
    } else {
      this.previewUrl = null;
    }
  }

  private clearPreview(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined;
    }

    this.previewUrl = null;
    this.isImagePreview = false;
  }
}