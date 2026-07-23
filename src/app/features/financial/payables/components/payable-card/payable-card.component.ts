import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Payable } from '../../models/Payable';

@Component({
  selector: 'app-payable-card',
  templateUrl: './payable-card.component.html',
  styleUrls: ['./payable-card.component.css'],
})
export class PayableCardComponent {
  @Input() payable!: Payable;

  @Output() pay = new EventEmitter<Payable>();
  @Output() installment = new EventEmitter<Payable>();
  @Output() details = new EventEmitter<Payable>();
  @Output() files = new EventEmitter<Payable>();
  @Output() delete = new EventEmitter<Payable>();
  @Output() overdueDetails = new EventEmitter<Payable>();

  getPayableOpenAmount(): number {
    if (this.payable.paid) {
      return 0;
    }

    const amount = Number(this.payable.amount ?? 0);
    const paidAmount = this.hasPaymentRecord() ? Number(this.payable.subtotal ?? 0) : 0;
    if (amount > 0 && paidAmount >= amount) {
      return 0;
    }

    if (amount > 0 && paidAmount > 0 && paidAmount < amount) {
      return Math.round((amount - paidAmount) * 100) / 100;
    }

    const remaining = this.payable.remainingBalance;

    if (remaining != null && remaining > 0 && remaining < amount) {
      return Number(remaining);
    }

    return amount;
  }

  getPaidAmount(): number {
    const amount = Number(this.payable.amount ?? 0);

    if (this.payable.paid) {
      return amount;
    }

    if (this.hasPaymentRecord() && this.payable.subtotal != null && this.payable.subtotal > 0) {
      return amount > 0 ? Math.min(Number(this.payable.subtotal), amount) : Number(this.payable.subtotal);
    }

    if (this.isPartiallyPaid()) {
      return amount - this.getPayableOpenAmount();
    }

    return 0;
  }

  getCurrentAmount(): number {
    if (this.payable.paid) {
      return Number(this.payable.amount ?? 0);
    }

    return Number(this.payable.currentAmountWithLateCharges ?? this.payable.amount ?? 0);
  }

  isPartiallyPaid(): boolean {
    if (this.payable.paid || this.payable.canceled) {
      return false;
    }

    const amount = Number(this.payable.amount ?? 0);
    const remaining = this.payable.remainingBalance;
    const paidAmount = this.hasPaymentRecord() ? Number(this.payable.subtotal ?? 0) : 0;

    return (
      amount > 0 &&
      ((paidAmount > 0 && paidAmount < amount) ||
        (remaining != null && remaining > 0 && remaining < amount))
    );
  }

  isPayableSettled(): boolean {
    return Boolean(this.payable.paid);
  }

  isOverdueOpenPayable(): boolean {
    if (this.payable.paid || this.payable.canceled || !this.payable.dueDate) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(this.payable.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate.getTime() < today.getTime() && this.getPayableOpenAmount() > 0;
  }

  showOverdueDetails(): void {
    if (!this.isOverdueOpenPayable()) {
      return;
    }

    this.overdueDetails.emit(this.payable);
  }

  getStatusLabel(): string {
    if (this.payable.canceled) {
      return 'Cancelada';
    }

    if (this.isPartiallyPaid()) {
      return 'Pago Parcialmente';
    }

    return this.isPayableSettled() ? 'Pago' : 'Pendente';
  }

  getStatusClass(): string {
    if (this.payable.canceled) {
      return 'status-canceled';
    }

    if (this.isPartiallyPaid()) {
      return 'status-partial';
    }

    return this.isPayableSettled() ? 'status-paid' : 'status-open';
  }

  private hasPaymentRecord(): boolean {
    return Boolean(this.payable.paid || this.payable.paymentDate);
  }
}
