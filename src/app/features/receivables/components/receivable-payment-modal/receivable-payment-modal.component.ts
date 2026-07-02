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

  constructor(private paymentMethodService: PaymentMethodService) {}

  ngOnInit(): void {
    this.loadPaymentMethods();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue) {
      this.paymentDate = this.todayDateString();
      this.paymentMethodId = this.receivable?.paymentMethodId ?? this.paymentMethodId;
    }
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  getOriginalAmount(): number {
    return Number(this.receivable?.amount ?? 0);
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
      this.getOriginalAmount() + this.getLateFee() + this.getLateInterest() - this.getDiscount(),
    );
  }

  submit(): void {
    if (!this.paymentMethodId) {
      return;
    }

    this.pay.emit({
      paymentAmount: this.getCurrentAmount(),
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
        },
      });
  }

  private hasDiscountPaymentMethod(): boolean {
    const method = this.paymentMethods.find((item) => item.id === Number(this.paymentMethodId));
    const name = this.normalize(method?.name ?? '');

    return name === 'pix' || name === 'boleto bancario';
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
