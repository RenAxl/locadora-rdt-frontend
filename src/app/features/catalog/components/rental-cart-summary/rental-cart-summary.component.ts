import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { RentalItem } from 'src/app/features/rental/basic-rental/models/rental';
import { RentalCartService } from 'src/app/features/rental/basic-rental/services/rental-cart.service';

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
    this.visible = false;
    this.router.navigate(['/rentals/create']);
  }
}
