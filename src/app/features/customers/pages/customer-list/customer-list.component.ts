import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Customer } from '../../models/Customer';
import { Pagination } from 'src/app/core/models/Pagination';
import { CustomerService } from '../../services/customer.service';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, EMPTY } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { CustomerMapper } from '../../mapper/customer.mapper';
import {
  addSelectedId,
  removeSelectedId,
} from 'src/app/core/utils/selection.util';
import { PhotoUrlRegistry } from 'src/app/core/utils/photo-preview.util';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
})
export class CustomerListComponent implements OnInit, OnDestroy {
  customers: Customer[] = [];

  pagination: Pagination = new Pagination();

  totalElements: number = 0;

  filterName: string = '';

  @ViewChild('customerTable') grid!: Table;

  photoMap: { [key: number]: SafeUrl } = {};

  selectedCustomers: Customer[] = [];

  selectedCustomerIds: number[] = [];

  detailsVisible = false;

  customerDetails: Customer | null = null;

  filesVisible: boolean = false;

  selectedCustomerId?: number;
  selectedCustomerName?: string;
  private photoUrls: PhotoUrlRegistry;

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
  ) {
    this.photoUrls = new PhotoUrlRegistry(sanitizer);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.photoUrls.clear();
  }

  list(page: number = 0): void {
    this.pagination.page = page;

    this.customerService
      .list(this.pagination, this.filterName)
      .subscribe((data) => {
        this.customers = data.content.map(CustomerMapper.fromDTO);
        this.totalElements = data.totalElements;

        this.loadPhotos();
      });
  }

  changePage(event: LazyLoadEvent): void {
    const page = event!.first! / event!.rows!;
    this.list(page);
  }

  searchCustomer(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(customer: Customer): void {
    if (!customer.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.customerService.delete(customer.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Cliente excluído com sucesso!',
          });
        });
      },
    });
  }

  private loadPhotos(): void {
    this.photoUrls.clear();
    this.photoMap = {};

    this.customers.forEach((customer) => {
      if (!customer?.id) return;

      this.customerService
        .getCustomerPhoto(customer.id)
        .pipe(
          catchError(() => {
            // 404 = sem foto (não é erro)
            return EMPTY;
          }),
        )
        .subscribe((blob: Blob) => {
          const photoUrl = this.photoUrls.create(blob);

          if (photoUrl) {
            this.photoMap[customer.id!] = photoUrl;
          }
        });
    });
  }

  onRowSelect(event: any): void {
    this.selectedCustomerIds = addSelectedId(
      this.selectedCustomerIds,
      event?.data,
    );
  }

  onRowUnselect(event: any): void {
    this.selectedCustomerIds = removeSelectedId(
      this.selectedCustomerIds,
      event?.data,
    );
  }

  deleteSelectedCustomers(): void {
    if (!this.selectedCustomerIds || this.selectedCustomerIds.length === 0)
      return;

    const ids = [...this.selectedCustomerIds];

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${ids.length} cliente(s)?`,
      accept: () => {
        this.customerService.deleteAll(ids).subscribe(() => {
          this.selectedCustomerIds = [];
          this.selectedCustomers = [];

          this.grid.reset();

          this.messageService.add({
            severity: 'success',
            detail: 'Clientes excluídos com sucesso!',
          });
        });
      },
    });
  }

  changeActive(customer: Customer): void {
    if (!customer?.id) return;

    const newStatus = !customer.active;

    this.customerService.changeActive(customer.id, newStatus).subscribe({
      next: () => {
        customer.active = newStatus;

        this.messageService.add({
          severity: 'success',
          detail: `Cliente ${newStatus ? 'ativado' : 'desativado'} com sucesso!`,
        });
      },
    });
  }

  openDetails(customer: Customer): void {
    const id = customer?.id;

    if (id == null) return;

    this.detailsVisible = true;
    this.customerDetails = null;

    this.customerService.findById(id).subscribe({
      next: (details) => {
        this.customerDetails = CustomerMapper.fromDetailsDTO(details);
      },
    });
  }

  openFilesModal(customer: Customer): void {
    this.selectedCustomerId = customer.id;
    this.selectedCustomerName = customer.name;
    this.filesVisible = true;
  }

  hasAuthority(role: string): boolean {
    return this.authService.hasAuthority(role);
  }
}
