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
import { CustomerFileService } from '../../services/customer-file.service';
import { CustomerFile } from '../../models/CustomerFile';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-customer-files-modal',
  templateUrl: './customer-files-modal.component.html',
  styleUrls: ['./customer-files-modal.component.css'],
})
export class CustomerFilesModalComponent implements OnDestroy, OnChanges {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() customerId?: number;
  @Input() customerName?: string;

  fileName: string = '';
  selectedFile: File | null = null;
  selectedFileName: string = '';
  previewUrl: SafeUrl | null = null;
  isImagePreview: boolean = false;

  files: CustomerFile[] = [];
  loadingFiles: boolean = false;

  private objectUrl?: string;
  private objectUrls: string[] = [];

  constructor(
    private customerFileService: CustomerFileService,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['visible'] && this.visible) ||
      (changes['customerId'] && this.customerId && this.visible)
    ) {
      this.loadFiles();
    }
  }

  ngOnDestroy(): void {
    this.clearPreview();
    this.clearObjectUrls();
  }

  loadFiles(): void {
    if (!this.customerId) {
      return;
    }

    this.loadingFiles = true;
    this.clearObjectUrls();

    this.customerFileService.findAllByCustomer(this.customerId).subscribe({
      next: (response) => {
        this.files = response;
        this.loadingFiles = false;
        this.loadImagePreviews();
      },
      error: (error) => {
        console.error('Erro ao carregar arquivos do cliente:', error);
        this.loadingFiles = false;
      },
    });
  }

  private loadImagePreviews(): void {
    if (!this.customerId) {
      return;
    }

    this.files.forEach((file) => {
      if (!file.id || !this.isImageFile(file)) {
        return;
      }

      this.customerFileService.getViewBlob(this.customerId!, file.id!).subscribe({
        next: (blob) => {
          if (!blob || blob.size === 0) {
            file.previewError = true;
            return;
          }

          const objectUrl = URL.createObjectURL(blob);

          file.previewUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          file.previewError = false;

          this.objectUrls.push(objectUrl);
        },
        error: (error) => {
          console.error(`Erro ao carregar preview do arquivo ${file.id}:`, error);
          file.previewError = true;
        },
      });
    });
  }

  onImageError(file: CustomerFile): void {
    file.previewError = true;
    file.previewUrl = undefined;
  }

  isImageFile(file: CustomerFile): boolean {
    return (
      (!!file.contentType && file.contentType.startsWith('image/')) ||
      (!!file.fileName && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.fileName))
    );
  }

  getFileIconClass(file: CustomerFile): any {
    return {
      image: this.isImageFile(file),
      pdf: file.contentType === 'application/pdf',
      default: !this.isImageFile(file) && file.contentType !== 'application/pdf',
    };
  }

  getFileIconPiClass(file: CustomerFile): any {
    return {
      'pi-image': this.isImageFile(file),
      'pi-file-pdf': file.contentType === 'application/pdf',
      'pi-file': !this.isImageFile(file) && file.contentType !== 'application/pdf',
    };
  }

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
        next: () => {
          this.clearForm();
          this.loadFiles();
        },
        error: (error) => {
          console.error('Erro ao enviar arquivo:', error);
        },
      });
  }

  clearForm(): void {
    this.fileName = '';
    this.selectedFile = null;
    this.selectedFileName = '';
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

  private clearObjectUrls(): void {
    this.objectUrls.forEach((url) => URL.revokeObjectURL(url));
    this.objectUrls = [];

    this.files.forEach((file) => {
      file.previewUrl = undefined;
      file.previewError = false;
    });
  }

   deleteFile(file: CustomerFile): void {
    if (!this.customerId || !file.id) {
      return;
    }

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o arquivo "${file.name}"?`,
      accept: () => {
        this.customerFileService.delete(this.customerId!, file.id!).subscribe({
          next: () => {
            this.loadFiles();
          },
        });
      },
    });
  }

   downloadFile(file: CustomerFile): void {
    if (!this.customerId || !file.id) {
      return;
    }

    this.customerFileService.download(this.customerId, file.id).subscribe({
      next: (response) => {
        const blob = response.body;

        if (!blob) {
          this.messageService.add({
            severity: 'warn',
            detail: 'Arquivo não disponível para download.',
          });
          return;
        }

        const fileName = this.extractFileNameFromResponse(response, file);
        const objectUrl = URL.createObjectURL(blob);

        const anchor = document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = fileName;
        anchor.click();

        URL.revokeObjectURL(objectUrl);

        this.messageService.add({
          severity: 'success',
          detail: 'Download realizado com sucesso!',
        });
      },
      error: (error) => {
        console.error('Erro ao fazer download do arquivo:', error);
        this.messageService.add({
          severity: 'error',
          detail: 'Erro ao fazer download do arquivo.',
        });
      },
    });
  }

  private extractFileNameFromResponse(response: any, file: CustomerFile): string {
    const contentDisposition = response.headers.get('content-disposition');

    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';\n]+)["']?/i);

      if (fileNameMatch?.[1]) {
        return decodeURIComponent(fileNameMatch[1]);
      }
    }

    return file.fileName || file.name || 'arquivo';
  }
}