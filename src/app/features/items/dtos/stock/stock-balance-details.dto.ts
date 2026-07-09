import { StockBalanceDTO } from './stock-balance.dto';

export interface StockBalanceDetailsDTO extends StockBalanceDTO {
  version?: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}
