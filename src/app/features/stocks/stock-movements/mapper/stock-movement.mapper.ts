import { StockMovementInsertDTO } from '../dtos/stock-movement-insert.dto';
import { StockMovementDTO } from '../dtos/stock-movement.dto';
import { StockMovement } from '../models/StockMovement';

export class StockMovementMapper {
  static fromDTO(dto: StockMovementDTO): StockMovement {
    return new StockMovement({
      id: dto.id,
      itemId: dto.itemId ?? undefined,
      itemName: dto.itemName ?? undefined,
      type: dto.type ?? 'ENTRY',
      quantity: dto.quantity ?? undefined,
      reason: dto.reason ?? undefined,
      referenceType: dto.referenceType ?? undefined,
      referenceId: dto.referenceId ?? undefined,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      createdBy: dto.createdBy ?? undefined,
    });
  }

  static toInsertDTO(movement: StockMovement): StockMovementInsertDTO {
    return {
      itemId: movement.itemId ?? null,
      type: movement.type,
      quantity: movement.quantity ?? null,
      reason: movement.reason ?? null,
      referenceType: movement.referenceType ?? null,
      referenceId: movement.referenceId ?? null,
    };
  }
}
