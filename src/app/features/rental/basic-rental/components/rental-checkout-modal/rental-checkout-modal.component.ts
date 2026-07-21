import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentMethodDTO } from 'src/app/features/payment-methods/dtos/payment-method.dto';
import { Rental } from '../../models/rental';

@Component({
  selector: 'app-rental-checkout-modal',
  templateUrl: './rental-checkout-modal.component.html',
  styleUrls: ['./rental-checkout-modal.component.css'],
})
export class RentalCheckoutModalComponent {
  today = new Date();
  @Input() visible = false;
  @Input() rental: Rental | null = null;
  @Input() paymentMethods: PaymentMethodDTO[] = [];
  @Input() paymentMethodId?: number;
  @Input() saving = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() paymentMethodIdChange = new EventEmitter<number>();
  @Output() confirm = new EventEmitter<void>();

  get rentalValue(): number {
    return Number(this.rental?.totalAmount || 0);
  }

  get lateFee(): number {
    return Number(this.rental?.calculatedLateFee || 0);
  }

  get discount(): number {
    if (this.lateFee > 0 || !this.hasDiscountPaymentMethod()) {
      return 0;
    }
    return this.rentalValue * 0.05;
  }

  get total(): number {
    return this.rentalValue + this.lateFee - this.discount;
  }

  get hasLateFeeDiscountWarning(): boolean {
    return this.lateFee > 0 && this.hasDiscountPaymentMethod();
  }

  changePaymentMethod(value: number): void {
    this.paymentMethodId = value;
    this.paymentMethodIdChange.emit(value);
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  private hasDiscountPaymentMethod(): boolean {
    const paymentMethod = this.paymentMethods.find((item) => item.id === Number(this.paymentMethodId));
    const name = this.normalize(paymentMethod?.name || '');
    return name === 'pix' || name.includes('boleto bancario');
  }

  private normalize(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
}
