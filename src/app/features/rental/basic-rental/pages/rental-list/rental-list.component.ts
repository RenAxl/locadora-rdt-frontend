import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Pagination } from 'src/app/core/models/Pagination';
import { RentalTypeDTO } from '../../../rentaltypes/dtos/rental-type.dto';
import { RentalTypeService } from '../../../rentaltypes/services/rental-type.service';
import { Rental } from '../../models/rental';
import { RentalFilter, RentalService } from '../../services/rental.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-rental-list',
  templateUrl: './rental-list.component.html',
  styleUrls: ['./rental-list.component.css'],
})
export class RentalListComponent implements OnInit {
  rentals: Rental[] = [];
  rentalTypes: RentalTypeDTO[] = [];
  pagination = new Pagination(0, 10, 'DESC', 'rental_date');
  totalElements = 0;
  filter: RentalFilter = {};
  canCreateRental = false;

  constructor(
    private rentalService: RentalService,
    private rentalTypeService: RentalTypeService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.canCreateRental = this.authService.hasAnyAuthority([
      'ROLE_ADMINISTRADOR',
      'ROLE_CLIENTE',
    ]);
    this.loadRentalTypes();
    this.list();
  }

  list(page: number = 0): void {
    this.pagination.page = page;
    const filter = { ...this.filter };
    if (filter.dateFrom) filter.dateFrom = new Date(filter.dateFrom + 'T00:00:00').toISOString();
    if (filter.dateTo) filter.dateTo = new Date(filter.dateTo + 'T23:59:59').toISOString();
    this.rentalService.list(this.pagination, filter).subscribe((data) => {
      this.rentals = data.content;
      this.totalElements = data.totalElements;
    });
  }

  changePage(event: any): void { this.list(event.page ?? 0); }
  clearFilters(): void { this.filter = {}; this.list(); }
  details(rental: Rental): void { this.router.navigate(['/rentals', rental.id]); }
  edit(rental: Rental): void { this.router.navigate(['/rentals', rental.id, 'edit']); }

  confirm(rental: Rental): void {
    if (!rental.id) return;
    this.confirmationService.confirm({
      message: 'Deseja alugar os itens desta locação?',
      accept: () => this.rentalService.confirm(rental.id!).subscribe(() => {
        this.messageService.add({ severity: 'success', detail: 'Locação alugada!' });
        this.list(this.pagination.page);
      }),
    });
  }

  start(rental: Rental): void {
    if (!rental.id) return;
    this.confirmationService.confirm({
      message: 'Deseja marcar esta locação como entregue?',
      accept: () => this.rentalService.start(rental.id!).subscribe(() => {
        this.messageService.add({ severity: 'success', detail: 'Locação entregue!' });
        this.list(this.pagination.page);
      }),
    });
  }

  cancel(rental: Rental): void {
    if (!rental.id) return;
    this.confirmationService.confirm({
      message: 'Deseja cancelar esta locação e liberar as unidades reservadas?',
      accept: () => this.rentalService.cancel(rental.id!).subscribe(() => {
        this.messageService.add({ severity: 'success', detail: 'Locação cancelada e unidades liberadas!' });
        this.list(this.pagination.page);
      }),
    });
  }

  delete(rental: Rental): void {
    if (!rental.id) return;
    this.confirmationService.confirm({
      message: 'Deseja excluir este rascunho?',
      accept: () => this.rentalService.delete(rental.id!).subscribe(() => {
        this.messageService.add({ severity: 'success', detail: 'Rascunho excluído!' });
        this.list();
      }),
    });
  }

  statusLabel(status?: string): string {
    if (status === 'RENTED') return 'Alugada';
    if (status === 'DELIVERED') return 'Entregue';
    return status || '-';
  }

  private loadRentalTypes(): void {
    this.rentalTypeService.list(new Pagination(0, 100), '').subscribe((data) => {
      this.rentalTypes = data.content;
    });
  }
}
