import { ReceivableDTO } from '../dtos/receivable.dto';
import { Receivable } from '../models/Receivable';

export class ReceivableMapper {
  static fromDTO(dto: ReceivableDTO): Receivable {
    return new Receivable({
      id: dto.id,
      description: dto.description,
      amount: dto.amount ?? null,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : null,
      createdDate: dto.createdDate ? new Date(dto.createdDate) : null,
      fileName: dto.fileName ?? null,
      paid: dto.paid ?? false,
      remainingBalance: dto.remainingBalance ?? null,
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
}
