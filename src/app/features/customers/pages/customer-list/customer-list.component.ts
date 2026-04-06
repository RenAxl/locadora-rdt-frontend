import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
})
export class CustomerListComponent implements OnInit {
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

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {}

  list(page: number = 0): void {
    this.pagination.page = page;

    this.customerService
      .list(this.pagination, this.filterName)
      .subscribe((data) => {
        this.customers = data.content;
        this.totalElements = data.totalElements;

        this.loadPhotos();
      });
  }

  changePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;
    this.list(page);
  }

  searchCustomer(name: string) {
    this.filterName = name;
    this.list();
  }

  delete(customer: any) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.customerService.delete(customer.id).subscribe(() => {
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
          if (!blob || blob.size === 0) return;

          const objectUrl = URL.createObjectURL(blob);
          this.photoMap[customer.id!] =
            this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        });
    });
  }

  onRowSelect(event: any): void {
    const id = event?.data?.id;
    if (id == null) return;

    if (!this.selectedCustomerIds.includes(id)) {
      this.selectedCustomerIds.push(id);
    }

    console.log('IDs selecionados:', this.selectedCustomerIds);
  }

  onRowUnselect(event: any): void {
    const id = event?.data?.id;
    if (id == null) return;

    this.selectedCustomerIds = this.selectedCustomerIds.filter((x) => x !== id);

    console.log('IDs selecionados:', this.selectedCustomerIds);
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
    console.log(customer.id);

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
      next: (details: Customer) => {
        this.customerDetails = details;
      },
    });
  }

  openFilesModal(customer: Customer): void {
    this.selectedCustomerId = customer.id;
    this.selectedCustomerName = customer.name;
    this.filesVisible = true;
  }

  hasAuthority(role: string) {
    return this.authService.hasAuthority(role);
  }
}
