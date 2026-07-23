import { Component, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, EMPTY } from 'rxjs';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Pagination } from 'src/app/core/models/Pagination';
import { SupplierMapper } from '../../mapper/supplier.mapper';
import { Supplier } from '../../models/Supplier';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css'],
})
export class SupplierListComponent implements OnDestroy {
  suppliers: Supplier[] = [];
  pagination = new Pagination();
  totalElements = 0;
  filterName = '';
  imageMap: Record<number, SafeUrl> = {};
  detailsVisible = false;
  filesVisible = false;
  supplierDetails: Supplier | null = null;
  selectedSupplierId?: number;
  selectedSupplierName?: string;

  @ViewChild('supplierTable') grid!: Table;

  private imageObjectUrls: string[] = [];

  constructor(
    private supplierService: SupplierService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnDestroy(): void {
    this.clearImageObjectUrls();
  }

  list(page = 0): void {
    this.pagination.page = page;
    this.supplierService.list(this.pagination, this.filterName).subscribe((data) => {
      this.suppliers = data.content.map(SupplierMapper.fromDTO);
      this.totalElements = data.totalElements;
      this.loadImages();
    });
  }

  changePage(event: LazyLoadEvent): void {
    this.list(event.first! / event.rows!);
  }

  searchSupplier(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(supplier: Supplier): void {
    if (!supplier.id) return;
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => this.supplierService.delete(supplier.id!).subscribe(() => {
        this.grid.reset();
        this.messageService.add({ severity: 'success', detail: 'Fornecedor excluído com sucesso!' });
      }),
    });
  }

  openDetails(supplier: Supplier): void {
    if (!supplier.id) return;
    this.detailsVisible = true;
    this.supplierDetails = null;
    this.supplierService.findById(supplier.id).subscribe((dto) => {
      this.supplierDetails = SupplierMapper.fromDetailsDTO(dto);
    });
  }

  openFilesModal(supplier: Supplier): void {
    this.selectedSupplierId = supplier.id;
    this.selectedSupplierName = supplier.name;
    this.filesVisible = true;
  }

  private loadImages(): void {
    this.clearImageObjectUrls();
    this.imageMap = {};
    this.suppliers.forEach((supplier) => {
      if (!supplier.id) return;
      this.supplierService.getImage(supplier.id).pipe(catchError(() => EMPTY)).subscribe((blob) => {
        if (!blob || blob.size === 0) return;
        const objectUrl = URL.createObjectURL(blob);
        this.imageObjectUrls.push(objectUrl);
        this.imageMap[supplier.id!] = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
      });
    });
  }

  private clearImageObjectUrls(): void {
    this.imageObjectUrls.forEach((url) => URL.revokeObjectURL(url));
    this.imageObjectUrls = [];
  }
}
