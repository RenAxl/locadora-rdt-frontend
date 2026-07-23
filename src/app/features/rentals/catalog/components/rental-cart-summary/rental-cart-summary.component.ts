import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { RentalItem } from 'src/app/features/rentals/rental/models/rental';
import { RentalCartService } from 'src/app/features/rentals/rental/services/rental-cart.service';
import { RentalService } from 'src/app/features/rentals/rental/services/rental.service';

@Component({
  selector: 'app-rental-cart-summary',
  templateUrl: './rental-cart-summary.component.html',
  styleUrls: ['./rental-cart-summary.component.css'],
})
export class RentalCartSummaryComponent implements OnInit, OnDestroy {
  items: RentalItem[] = [];
  totalQuantity = 0;
  visible = false;

  private subscription?: Subscription;

  constructor(
    private rentalCartService: RentalCartService,
    private rentalService: RentalService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subscription = this.rentalCartService.items$.subscribe((items) => {
      this.items = items;
      this.totalQuantity = items.reduce(
        (total, item) => total + item.quantity,
        0,
      );
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  open(): void {
    if (this.items.length === 0) {
      this.messageService.add({
        severity: 'info',
        detail: 'Não há itens selecionados.',
      });
      return;
    }

    this.visible = true;
  }

  finishRental(): void {
    this.rentalService.findCurrentCustomer().subscribe({
      next: () => {
        this.visible = false;
        this.router.navigate(['/rentals/create']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          detail: 'Você não é um cliente da Locadora RDT.',
        });
      },
    });
  }
}
