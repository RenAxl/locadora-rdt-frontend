import { ReceivableDTO } from '../dtos/receivable.dto';
import { ReceivableDetailsDTO } from '../dtos/receivable-details.dto';
import { ReceivableInsertDTO } from '../dtos/receivable-insert.dto';
import { ReceivableUpdateDTO } from '../dtos/receivable-update.dto';
import { Receivable } from '../models/Receivable';

export class ReceivableMapper {
  static fromDTO(dto: ReceivableDTO): Receivable {
    return new Receivable({
      id: dto.id,
      description: dto.description,
      amount: dto.amount ?? null,
      dueDate: ReceivableMapper.fromDateString(dto.dueDate),
      paymentDate: ReceivableMapper.fromDateString(dto.paymentDate),
      createdDate: ReceivableMapper.fromDateString(dto.createdDate),
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
      parentReceivableId: dto.parentReceivableId ?? null,
      customerId: dto.customerId ?? null,
      customerName: dto.customerName ?? null,
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

  static fromDetailsDTO(dto: ReceivableDetailsDTO): Receivable {
    return this.fromDTO(dto);
  }

  static toInsertDTO(receivable: Receivable): ReceivableInsertDTO {
    return {
      description: receivable.description || null,
      amount: receivable.amount ?? null,
      dueDate: ReceivableMapper.toDateString(receivable.dueDate),
      paymentDate: ReceivableMapper.toDateString(receivable.paymentDate),
      customerId: receivable.customerId ?? null,
      paymentMethodId: receivable.paymentMethodId ?? null,
      paymentFrequencyId: receivable.paymentFrequencyId ?? null,
      note: receivable.note ?? null,
      fileName: receivable.fileName ?? null,
    };
  }

  static toUpdateDTO(receivable: Receivable): ReceivableUpdateDTO {
    return {
      id: receivable.id!,
      ...this.toInsertDTO(receivable),
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
