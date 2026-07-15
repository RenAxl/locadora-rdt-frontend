import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Rental } from '../../models/rental';
import { RentalService } from '../../services/rental.service';

@Component({ selector: 'app-rental-details', templateUrl: './rental-details.component.html', styleUrls: ['./rental-details.component.css'] })
export class RentalDetailsComponent implements OnInit {
  rental?: Rental;
  constructor(private route: ActivatedRoute, private rentalService: RentalService) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('rentalId');
    if (id) this.rentalService.findById(id).subscribe((rental) => this.rental = rental);
  }
  statusLabel(status?: string): string { return status === 'DRAFT' ? 'Rascunho' : status === 'CONFIRMED' ? 'Confirmada' : status || '-'; }
}
