import { StockBalanceDetailsDTO } from '../dtos/stock/stock-balance-details.dto';
import { StockBalanceUpdateDTO } from '../dtos/stock/stock-balance-update.dto';
import { StockBalanceDTO } from '../dtos/stock/stock-balance.dto';
import { StockBalance } from '../models/stock/StockBalance';

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

  static toUpdateDTO(balance: StockBalance): StockBalanceUpdateDTO {
    return {
      id: balance.id!,
      totalQuantity: balance.totalQuantity ?? 0,
      reservedQuantity: balance.reservedQuantity ?? 0,
      unavailableQuantity: balance.unavailableQuantity ?? 0,
      minimumQuantity: balance.minimumQuantity ?? 0,
    };
  }
}
