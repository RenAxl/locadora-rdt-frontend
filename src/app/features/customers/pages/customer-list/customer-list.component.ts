import { Component, OnInit, ViewChild } from '@angular/core';
import { Customer } from '../../models/Customer';
import { Pagination } from 'src/app/core/models/Pagination';
import { CustomerService } from '../../services/customer.service';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/error/services/error-handler.service';
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

  hasAuthority(role: string) {
    return this.authService.hasAuthority(role);
  }
}
