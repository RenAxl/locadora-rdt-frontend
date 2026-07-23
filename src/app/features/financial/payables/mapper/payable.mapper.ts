import { PayableDTO } from '../dtos/payable.dto';
import { PayableDetailsDTO } from '../dtos/payable-details.dto';
import { PayableInsertDTO } from '../dtos/payable-insert.dto';
import { PayableUpdateDTO } from '../dtos/payable-update.dto';
import { Payable } from '../models/Payable';

export class PayableMapper {
  static fromDTO(dto: PayableDTO): Payable {
    return new Payable({
      id: dto.id,
      description: dto.description,
      amount: dto.amount ?? null,
      dueDate: PayableMapper.fromDateString(dto.dueDate),
      paymentDate: PayableMapper.fromDateString(dto.paymentDate),
      createdDate: PayableMapper.fromDateString(dto.createdDate),
      createdAt: dto.createdAt ? new Date(dto.createdAt) : null,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : null,
      note: dto.note ?? null,
      fileName: dto.fileName ?? null,
      paid: dto.paid ?? false,
      remainingBalance: dto.remainingBalance ?? null,
      lateFee: dto.lateFee ?? null,
      lateInterest: dto.lateInterest ?? null,
      discount: dto.discount ?? null,
      fee: dto.fee ?? null,
      subtotal: dto.subtotal ?? null,
      currentAmountWithLateCharges: dto.currentAmountWithLateCharges ?? null,
      overdueDays: dto.overdueDays ?? null,
      calculatedLateInterest: dto.calculatedLateInterest ?? null,
      calculatedLateFee: dto.calculatedLateFee ?? null,
      residual: dto.residual ?? false,
      canceled: dto.canceled ?? false,
      parentPayableId: dto.parentPayableId ?? null,
      supplierId: dto.supplierId ?? null,
      supplierName: dto.supplierName ?? null,
      employeeId: dto.employeeId ?? null,
      employeeName: dto.employeeName ?? null,
      paymentMethodId: dto.paymentMethodId ?? null,
      paymentMethodName: dto.paymentMethodName ?? null,
      paymentFrequencyId: dto.paymentFrequencyId ?? null,
      paymentFrequency: dto.paymentFrequency ?? null,
      createdById: dto.createdById ?? null,
      createdByName: dto.createdByName ?? null,
      paidById: dto.paidById ?? null,
      paidByName: dto.paidByName ?? null,
    });
  }

  static fromDetailsDTO(dto: PayableDetailsDTO): Payable {
    return this.fromDTO(dto);
  }

  static toInsertDTO(payable: Payable): PayableInsertDTO {
    return {
      description: payable.description || null,
      amount: payable.amount ?? null,
      dueDate: PayableMapper.toDateString(payable.dueDate),
      paymentDate: PayableMapper.toDateString(payable.paymentDate),
      supplierId: payable.supplierId ?? null,
      employeeId: payable.employeeId ?? null,
      paymentMethodId: payable.paymentMethodId ?? null,
      paymentFrequencyId: payable.paymentFrequencyId ?? null,
      note: payable.note ?? null,
      fileName: payable.fileName ?? null,
    };
  }

  static toUpdateDTO(payable: Payable): PayableUpdateDTO {
    return {
      id: payable.id!,
      ...this.toInsertDTO(payable),
    };
  }

  private static toDateString(date?: Date | string | null): string | null {
    if (!date) {
      return null;
    }

    if (typeof date === 'string') {
      return date.substring(0, 10);
    }

    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${date.getFullYear()}-${month}-${day}`;
  }

  private static fromDateString(date?: string | null): Date | null {
    if (!date) {
      return null;
    }

    const [year, month, day] = date.substring(0, 10).split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}
