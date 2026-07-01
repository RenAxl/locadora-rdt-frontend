import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ReceivableFile } from '../../models/ReceivableFile';
import { ReceivableFileService } from '../../services/receivable-file.service';

@Component({
  selector: 'app-receivable-files-modal',
  templateUrl: './receivable-files-modal.component.html',
  styleUrls: ['./receivable-files-modal.component.css'],
})
export class ReceivableFilesModalComponent implements OnChanges {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() receivableId?: number;
  @Input() receivableDescription?: string;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  fileName = '';
  selectedFile: File | null = null;
  selectedFileName = '';
  files: ReceivableFile[] = [];
  loadingFiles = false;

  constructor(
    private receivableFileService: ReceivableFileService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['visible'] && this.visible) || (changes['receivableId'] && this.receivableId && this.visible)) {
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
    if (!this.receivableId) {
      return;
    }

    this.loadingFiles = true;
    this.receivableFileService.findAllByReceivable(this.receivableId).subscribe({
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
    if (!this.receivableId || !this.selectedFile || !this.fileName.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Informe nome e arquivo.',
      });
      return;
    }

    this.receivableFileService
      .upload(this.receivableId, this.fileName.trim(), this.selectedFile)
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', detail: 'Arquivo enviado.' });
          this.clearForm();
          this.loadFiles();
        },
      });
  }

  download(file: ReceivableFile): void {
    if (!this.receivableId || !file.id) {
      return;
    }

    this.receivableFileService.download(this.receivableId, file.id).subscribe((response) => {
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

  delete(file: ReceivableFile): void {
    if (!this.receivableId || !file.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este arquivo?',
      accept: () => {
        this.receivableFileService.delete(this.receivableId!, file.id!).subscribe(() => {
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
