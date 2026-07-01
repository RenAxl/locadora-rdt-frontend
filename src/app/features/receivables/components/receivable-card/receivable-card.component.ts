import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Receivable } from '../../models/Receivable';

@Component({
  selector: 'app-receivable-card',
  templateUrl: './receivable-card.component.html',
  styleUrls: ['./receivable-card.component.css'],
})
export class ReceivableCardComponent {
  @Input() receivable!: Receivable;

  @Output() pay = new EventEmitter<Receivable>();
  @Output() installment = new EventEmitter<Receivable>();
  @Output() details = new EventEmitter<Receivable>();
  @Output() files = new EventEmitter<Receivable>();
  @Output() receipt = new EventEmitter<Receivable>();
  @Output() delete = new EventEmitter<Receivable>();

  getReceivableOpenAmount(): number {
    if (this.receivable.paid) {
      return 0;
    }

    const amount = Number(this.receivable.amount ?? 0);
    const paidAmount = this.hasPaymentRecord() ? Number(this.receivable.subtotal ?? 0) : 0;
    if (amount > 0 && paidAmount >= amount) {
      return 0;
    }

    if (amount > 0 && paidAmount > 0 && paidAmount < amount) {
      return Math.round((amount - paidAmount) * 100) / 100;
    }

    const remaining = this.receivable.remainingBalance;

    if (remaining != null && remaining > 0 && remaining < amount) {
      return Number(remaining);
    }

    return amount;
  }

  getPaidAmount(): number {
    const amount = Number(this.receivable.amount ?? 0);

    if (this.receivable.paid) {
      return amount;
    }

    if (this.hasPaymentRecord() && this.receivable.subtotal != null && this.receivable.subtotal > 0) {
      return amount > 0 ? Math.min(Number(this.receivable.subtotal), amount) : Number(this.receivable.subtotal);
    }

    if (this.isPartiallyPaid()) {
      return amount - this.getReceivableOpenAmount();
    }

    return 0;
  }

  isPartiallyPaid(): boolean {
    if (this.receivable.paid || this.receivable.canceled) {
      return false;
    }

    const amount = Number(this.receivable.amount ?? 0);
    const remaining = this.receivable.remainingBalance;
    const paidAmount = this.hasPaymentRecord() ? Number(this.receivable.subtotal ?? 0) : 0;

    return (
      amount > 0 &&
      ((paidAmount > 0 && paidAmount < amount) ||
        (remaining != null && remaining > 0 && remaining < amount))
    );
  }

  isReceivableSettled(): boolean {
    return Boolean(this.receivable.paid);
  }

  getStatusLabel(): string {
    if (this.receivable.canceled) {
      return 'Cancelada';
    }

    if (this.isPartiallyPaid()) {
      return 'Pago Parcialmente';
    }

    return this.isReceivableSettled() ? 'Pago' : 'Pendente';
  }

  getStatusClass(): string {
    if (this.receivable.canceled) {
      return 'status-canceled';
    }

    if (this.isPartiallyPaid()) {
      return 'status-partial';
    }

    return this.isReceivableSettled() ? 'status-paid' : 'status-open';
  }

  private hasPaymentRecord(): boolean {
    return Boolean(this.receivable.paid || this.receivable.paymentDate);
  }
}
