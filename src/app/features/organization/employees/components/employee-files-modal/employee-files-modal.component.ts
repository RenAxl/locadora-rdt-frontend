import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { ConfirmationService, MessageService } from 'primeng/api';
import { EmployeeFile } from '../../models/EmployeeFile';
import { EmployeeFileService } from '../../services/employee-file.service';

@Component({
  selector: 'app-employee-files-modal',
  templateUrl: './employee-files-modal.component.html',
  styleUrls: ['./employee-files-modal.component.css'],
})
export class EmployeeFilesModalComponent implements OnDestroy, OnChanges {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() employeeId?: number;
  @Input() employeeName?: string;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  fileName: string = '';
  selectedFile: File | null = null;
  selectedFileName: string = '';
  previewUrl: SafeUrl | null = null;
  isImagePreview: boolean = false;

  files: EmployeeFile[] = [];
  loadingFiles: boolean = false;

  private objectUrl?: string;
  private objectUrls: string[] = [];

  constructor(
    private employeeFileService: EmployeeFileService,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employeeId'] && !changes['employeeId'].firstChange) {
      this.resetState();
    }

    if (
      (changes['visible'] && this.visible) ||
      (changes['employeeId'] && this.employeeId && this.visible)
    ) {
      this.loadFiles();
    }
  }

  ngOnDestroy(): void {
    this.clearPreview();
    this.clearObjectUrls();
  }

  onDialogVisibilityChange(visible: boolean): void {
    this.visible = visible;
    this.visibleChange.emit(visible);

    if (!visible) {
      this.resetState();
    }
  }

  private resetState(): void {
    this.fileName = '';
    this.selectedFile = null;
    this.selectedFileName = '';
    this.files = [];

    this.clearPreview();
    this.clearObjectUrls();

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
  loadFiles(): void {
    if (!this.employeeId) {
      return;
    }

    this.loadingFiles = true;
    this.clearObjectUrls();

    this.employeeFileService.findAllByEmployee(this.employeeId).subscribe({
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
    if (!this.employeeId) {
      return;
    }

    this.files.forEach((file) => {
      if (!file.id || !this.isImageFile(file)) {
        return;
      }

      this.employeeFileService
        .getViewBlob(this.employeeId!, file.id!)
        .subscribe({
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
            console.error(
              `Erro ao carregar preview do arquivo ${file.id}:`,
              error,
            );
            file.previewError = true;
          },
        });
    });
  }

  onImageError(file: EmployeeFile): void {
    file.previewError = true;
    file.previewUrl = undefined;
  }

  isImageFile(file: EmployeeFile): boolean {
    return (
      (!!file.contentType && file.contentType.startsWith('image/')) ||
      (!!file.fileName && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.fileName))
    );
  }

  getFileIconClass(file: EmployeeFile): any {
    return {
      image: this.isImageFile(file),
      pdf: file.contentType === 'application/pdf',
      default:
        !this.isImageFile(file) && file.contentType !== 'application/pdf',
    };
  }

  getFileIconPiClass(file: EmployeeFile): any {
    return {
      'pi-image': this.isImageFile(file),
      'pi-file-pdf': file.contentType === 'application/pdf',
      'pi-file':
        !this.isImageFile(file) && file.contentType !== 'application/pdf',
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
    if (!this.employeeId) {
      console.error('employeeId não informado.');
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

    this.employeeFileService
      .upload(this.employeeId, this.fileName.trim(), this.selectedFile)
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

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
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

  deleteFile(file: EmployeeFile): void {
    if (!this.employeeId || !file.id) {
      return;
    }

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o arquivo "${file.name}"?`,
      accept: () => {
        this.employeeFileService.delete(this.employeeId!, file.id!).subscribe({
          next: () => {
            this.loadFiles();
          },
        });
      },
    });
  }

  downloadFile(file: EmployeeFile): void {
    if (!this.employeeId || !file.id) {
      return;
    }

    this.employeeFileService.download(this.employeeId, file.id).subscribe({
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

  private extractFileNameFromResponse(
    response: any,
    file: EmployeeFile,
  ): string {
    const contentDisposition = response.headers.get('content-disposition');

    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(
        /filename\*?=(?:UTF-8'')?["']?([^"';\n]+)["']?/i,
      );

      if (fileNameMatch?.[1]) {
        return decodeURIComponent(fileNameMatch[1]);
      }
    }

    return file.fileName || file.name || 'arquivo';
  }
}
