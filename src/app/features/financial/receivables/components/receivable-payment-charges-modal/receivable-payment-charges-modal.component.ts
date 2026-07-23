import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-receivable-payment-charges-modal',
  templateUrl: './receivable-payment-charges-modal.component.html',
  styleUrls: ['./receivable-payment-charges-modal.component.css'],
})
export class ReceivablePaymentChargesModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() lateFee = 0;
  @Input() lateInterest = 0;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirmCharges = new EventEmitter<{ lateFee: number; lateInterest: number }>();

  editedLateFee = 0;
  editedLateInterest = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue) {
      this.editedLateFee = Number(this.lateFee ?? 0);
      this.editedLateInterest = Number(this.lateInterest ?? 0);
    }
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  confirm(): void {
    this.confirmCharges.emit({
      lateFee: this.roundMoney(this.editedLateFee),
      lateInterest: this.roundMoney(this.editedLateInterest),
    });
  }

  private roundMoney(value: number | null | undefined): number {
    return Math.round(Number(value ?? 0) * 100) / 100;
  }
}
