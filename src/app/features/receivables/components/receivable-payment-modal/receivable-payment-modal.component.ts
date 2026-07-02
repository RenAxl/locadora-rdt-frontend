import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Pagination } from 'src/app/core/models/Pagination';
import { PaymentMethodDTO } from 'src/app/features/payment-methods/dtos/payment-method.dto';
import { PaymentMethodService } from 'src/app/features/payment-methods/services/payment-method.service';

import { ReceivablePaymentDTO } from '../../dtos/receivable.dto';
import { Receivable } from '../../models/Receivable';

@Component({
  selector: 'app-receivable-payment-modal',
  templateUrl: './receivable-payment-modal.component.html',
  styleUrls: ['./receivable-payment-modal.component.css'],
})
export class ReceivablePaymentModalComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() receivable: Receivable | null = null;
  @Input() lateFee = 0;
  @Input() lateInterest = 0;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() pay = new EventEmitter<ReceivablePaymentDTO>();

  paymentMethods: PaymentMethodDTO[] = [];
  paymentMethodId: number | null = null;
  paymentDate = this.todayDateString();
  paymentAmount: number | null = null;

  constructor(private paymentMethodService: PaymentMethodService) {}

  ngOnInit(): void {
    this.loadPaymentMethods();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue) {
      this.paymentDate = this.todayDateString();
      this.paymentMethodId = this.receivable?.paymentMethodId ?? this.paymentMethodId;
      this.paymentAmount = this.getCurrentAmount();
    }
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  getOriginalAmount(): number {
    return Number(this.receivable?.amount ?? 0);
  }

  getOpenAmount(): number {
    if (this.receivable?.paid) {
      return 0;
    }

    const amount = this.getOriginalAmount();
    const paidAmount = this.hasPaymentRecord() ? Number(this.receivable?.subtotal ?? 0) : 0;
    if (amount > 0 && paidAmount >= amount) {
      return 0;
    }

    if (amount > 0 && paidAmount > 0 && paidAmount < amount) {
      return this.roundMoney(amount - paidAmount);
    }

    const remaining = this.receivable?.remainingBalance;
    if (remaining != null && remaining > 0 && remaining < amount) {
      return Number(remaining);
    }

    return amount;
  }

  getLateFee(): number {
    return this.roundMoney(this.lateFee);
  }

  getLateInterest(): number {
    return this.roundMoney(this.lateInterest);
  }

  getDiscount(): number {
    if (!this.hasDiscountPaymentMethod()) {
      return 0;
    }

    return this.roundMoney(this.getOriginalAmount() * 0.05);
  }

  getCurrentAmount(): number {
    return this.roundMoney(
      this.getOpenAmount() + this.getLateFee() + this.getLateInterest() - this.getDiscount(),
    );
  }

  getPaymentAmount(): number {
    return this.roundMoney(Number(this.paymentAmount ?? 0));
  }

  isPaymentAmountInvalid(): boolean {
    return this.isPaymentAmountEmptyOrZero() || this.isPaymentAmountGreaterThanCurrent();
  }

  isPaymentAmountEmptyOrZero(): boolean {
    const paymentAmount = this.getPaymentAmount();

    return paymentAmount <= 0;
  }

  isPaymentAmountGreaterThanCurrent(): boolean {
    return this.getPaymentAmount() > this.getCurrentAmount();
  }

  onPaymentMethodChange(): void {
    this.paymentAmount = this.getCurrentAmount();
  }

  submit(): void {
    if (!this.paymentMethodId || this.isPaymentAmountInvalid()) {
      return;
    }

    this.pay.emit({
      paymentAmount: this.getPaymentAmount(),
      paymentDate: this.paymentDate,
      paymentMethodId: this.paymentMethodId,
      subtotal: this.getOriginalAmount(),
      fee: 0,
      lateInterest: this.getLateInterest(),
      lateFee: this.getLateFee(),
      discount: this.getDiscount(),
    });
  }

  private loadPaymentMethods(): void {
    this.paymentMethodService
      .list(new Pagination(0, 100, 'ASC', 'name'), '')
      .subscribe({
        next: (data) => {
          this.paymentMethods = data.content;
          this.paymentMethodId = this.receivable?.paymentMethodId ?? this.paymentMethods[0]?.id ?? null;
          this.paymentAmount = this.getCurrentAmount();
        },
      });
  }

  private hasDiscountPaymentMethod(): boolean {
    const method = this.paymentMethods.find((item) => item.id === Number(this.paymentMethodId));
    const name = this.normalize(method?.name ?? '');

    return name === 'pix' || name === 'boleto bancario';
  }

  private hasPaymentRecord(): boolean {
    return Boolean(this.receivable?.paid || this.receivable?.paymentDate);
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  private roundMoney(value: number): number {
    return Math.round(Number(value ?? 0) * 100) / 100;
  }

  private todayDateString(): string {
    const today = new Date();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');
    const day = `${today.getDate()}`.padStart(2, '0');

    return `${today.getFullYear()}-${month}-${day}`;
  }
}
