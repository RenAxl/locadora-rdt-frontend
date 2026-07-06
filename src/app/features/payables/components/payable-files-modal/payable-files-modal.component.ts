import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PayableFile } from '../../models/PayableFile';
import { PayableFileService } from '../../services/payable-file.service';

@Component({
  selector: 'app-payable-files-modal',
  templateUrl: './payable-files-modal.component.html',
  styleUrls: ['./payable-files-modal.component.css'],
})
export class PayableFilesModalComponent implements OnChanges {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() payableId?: number;
  @Input() payableDescription?: string;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  fileName = '';
  selectedFile: File | null = null;
  selectedFileName = '';
  files: PayableFile[] = [];
  loadingFiles = false;

  constructor(
    private payableFileService: PayableFileService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['visible'] && this.visible) || (changes['payableId'] && this.payableId && this.visible)) {
      this.loadFiles();
    }
  }

  onDialogVisibilityChange(visible: boolean): void {
    this.visible = visible;
    this.visibleChange.emit(visible);
    if (!visible) {
      this.clearForm();
    }
  }

  loadFiles(): void {
    if (!this.payableId) {
      return;
    }

    this.loadingFiles = true;
    this.payableFileService.findAllByPayable(this.payableId).subscribe({
      next: (response) => {
        this.files = response;
        this.loadingFiles = false;
      },
      error: () => {
        this.files = [];
        this.loadingFiles = false;
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    this.selectedFile = file ?? null;
    this.selectedFileName = file?.name ?? '';
    if (file && !this.fileName.trim()) {
      this.fileName = file.name;
    }
  }

  upload(): void {
    if (!this.payableId || !this.selectedFile || !this.fileName.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Informe nome e arquivo.',
      });
      return;
    }

    this.payableFileService
      .upload(this.payableId, this.fileName.trim(), this.selectedFile)
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', detail: 'Arquivo enviado.' });
          this.clearForm();
          this.loadFiles();
        },
      });
  }

  download(file: PayableFile): void {
    if (!this.payableId || !file.id) {
      return;
    }

    this.payableFileService.download(this.payableId, file.id).subscribe((response) => {
      const blob = response.body;
      if (!blob) {
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.fileName || `arquivo-${file.id}`;
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  delete(file: PayableFile): void {
    if (!this.payableId || !file.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este arquivo?',
      accept: () => {
        this.payableFileService.delete(this.payableId!, file.id!).subscribe(() => {
          this.messageService.add({ severity: 'success', detail: 'Arquivo excluído.' });
          this.loadFiles();
        });
      },
    });
  }

  private clearForm(): void {
    this.fileName = '';
    this.selectedFile = null;
    this.selectedFileName = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
