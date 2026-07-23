import { PaymentFrequencyDetailsDTO } from '../dtos/payment-frequency-details.dto';
import { PaymentFrequencyInsertDTO } from '../dtos/payment-frequency-insert.dto';
import { PaymentFrequencyUpdateDTO } from '../dtos/payment-frequency-update.dto';
import { PaymentFrequencyDTO } from '../dtos/payment-frequency.dto';
import { PaymentFrequency } from '../models/PaymentFrequency';

export class PaymentFrequencyMapper {
  static fromDTO(dto: PaymentFrequencyDTO): PaymentFrequency {
    return new PaymentFrequency({
      id: dto.id,
      frequency: dto.frequency,
      days: dto.days,
    });
  }

  static fromDetailsDTO(dto: PaymentFrequencyDetailsDTO): PaymentFrequency {
    return new PaymentFrequency({
      id: dto.id,
      frequency: dto.frequency,
      days: dto.days,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : null,
      createdBy: dto.createdBy,
      updatedBy: dto.updatedBy,
    });
  }

  static toInsertDTO(
    paymentFrequency: PaymentFrequency,
  ): PaymentFrequencyInsertDTO {
    return {
      frequency: paymentFrequency.frequency,
      days: paymentFrequency.days ?? null,
    };
  }

  static toUpdateDTO(
    paymentFrequency: PaymentFrequency,
  ): PaymentFrequencyUpdateDTO {
    return {
      id: paymentFrequency.id!,
      frequency: paymentFrequency.frequency,
      days: paymentFrequency.days ?? null,
    };
  }
}
