import { PaymentMethodDetailsDTO } from '../dtos/payment-method-details.dto';
import { PaymentMethodInsertDTO } from '../dtos/payment-method-insert.dto';
import { PaymentMethodUpdateDTO } from '../dtos/payment-method-update.dto';
import { PaymentMethodDTO } from '../dtos/payment-method.dto';
import { PaymentMethod } from '../models/PaymentMethod';

export class PaymentMethodMapper {
  static fromDTO(dto: PaymentMethodDTO): PaymentMethod {
    return new PaymentMethod({
      id: dto.id,
      name: dto.name,
      fee: dto.fee,
    });
  }

  static fromDetailsDTO(dto: PaymentMethodDetailsDTO): PaymentMethod {
    return new PaymentMethod({
      id: dto.id,
      name: dto.name,
      fee: dto.fee,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : null,
      createdBy: dto.createdBy,
      updatedBy: dto.updatedBy,
    });
  }

  static toInsertDTO(paymentMethod: PaymentMethod): PaymentMethodInsertDTO {
    return {
      name: paymentMethod.name,
      fee: paymentMethod.fee ?? null,
    };
  }

  static toUpdateDTO(paymentMethod: PaymentMethod): PaymentMethodUpdateDTO {
    return {
      id: paymentMethod.id!,
      name: paymentMethod.name,
      fee: paymentMethod.fee ?? null,
    };
  }
}
