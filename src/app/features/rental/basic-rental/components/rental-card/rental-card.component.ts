import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Rental } from '../../models/rental';

@Component({
  selector: 'app-rental-card',
  templateUrl: './rental-card.component.html',
  styleUrls: ['./rental-card.component.css'],
})
export class RentalCardComponent {
  @Input() rental!: Rental;

  @Output() details = new EventEmitter<Rental>();
  @Output() start = new EventEmitter<Rental>();
  @Output() overdueDetails = new EventEmitter<Rental>();
  @Output() receipt = new EventEmitter<Rental>();
  @Output() fiscalCoupon = new EventEmitter<Rental>();

  isOverdue(): boolean {
    return Number(this.rental.overdueDays || 0) > 0;
  }

  statusLabel(): string {
    if (this.rental.status === 'RENTED') return 'Alugada';
    if (this.rental.status === 'DELIVERED') return 'Entregue';
    return this.rental.status || '-';
  }

  statusClass(): string {
    if (this.rental.status === 'DELIVERED') return 'status-delivered';
    return 'status-rented';
  }
}
