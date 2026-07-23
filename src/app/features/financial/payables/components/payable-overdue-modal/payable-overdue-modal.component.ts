import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Payable } from '../../models/Payable';

@Component({
  selector: 'app-payable-overdue-modal',
  templateUrl: './payable-overdue-modal.component.html',
  styleUrls: ['./payable-overdue-modal.component.css'],
})
export class PayableOverdueModalComponent {
  @Input() visible = false;
  @Input() payable: Payable | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  close(): void {
    this.visibleChange.emit(false);
  }

  getCurrentAmount(): number {
    return Number(this.payable?.currentAmountWithLateCharges ?? this.payable?.amount ?? 0);
  }

  getOverdueDays(): number {
    return Number(this.payable?.overdueDays ?? 0);
  }

  getCalculatedLateInterest(): number {
    return Number(this.payable?.calculatedLateInterest ?? 0);
  }

  getCalculatedLateFee(): number {
    return Number(this.payable?.calculatedLateFee ?? 0);
  }
}
