import { StockBalanceDetailsDTO } from '../dtos/stock-balance-details.dto';
import { StockBalanceDTO } from '../dtos/stock-balance.dto';
import { StockBalance } from '../models/StockBalance';

export class StockBalanceMapper {
  static fromDTO(dto: StockBalanceDTO): StockBalance {
    return new StockBalance({
      id: dto.id,
      itemId: dto.itemId ?? undefined,
      itemName: dto.itemName ?? undefined,
      totalQuantity: dto.totalQuantity ?? undefined,
      reservedQuantity: dto.reservedQuantity ?? undefined,
      unavailableQuantity: dto.unavailableQuantity ?? undefined,
      availableQuantity: dto.availableQuantity ?? undefined,
      minimumQuantity: dto.minimumQuantity ?? undefined,
      lowStock: dto.lowStock,
    });
  }

  static fromDetailsDTO(dto: StockBalanceDetailsDTO): StockBalance {
    const balance = StockBalanceMapper.fromDTO(dto);
    balance.createdAt = dto.createdAt ? new Date(dto.createdAt) : undefined;
    balance.updatedAt = dto.updatedAt ? new Date(dto.updatedAt) : undefined;
    balance.createdBy = dto.createdBy ?? undefined;
    balance.updatedBy = dto.updatedBy ?? undefined;
    return balance;
  }

}
