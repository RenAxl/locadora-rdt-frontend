import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Rental, RentalItemUnit, RentalStatusHistory } from '../../models/rental';
import { RentalService } from '../../services/rental.service';

@Component({ selector: 'app-rental-details', templateUrl: './rental-details.component.html', styleUrls: ['./rental-details.component.css'] })
export class RentalDetailsComponent implements OnInit {
  rental?: Rental;
  units: RentalItemUnit[] = [];
  history: RentalStatusHistory[] = [];
  constructor(private route: ActivatedRoute, private rentalService: RentalService) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('rentalId');
    if (id) {
      this.rentalService.findById(id).subscribe((rental) => this.rental = rental);
      this.rentalService.findRentalUnits(id).subscribe((units) => this.units = units);
      this.rentalService.findHistory(id).subscribe((history) => this.history = history);
    }
  }
  statusLabel(status?: string): string {
    if (status === 'RENTED') return 'Alugada';
    if (status === 'RESERVED') return 'Reservada';
    if (status === 'DELIVERED') return 'Entregue';
    if (status === 'RETURNED') return 'Devolvida';
    return status || '-';
  }
}
