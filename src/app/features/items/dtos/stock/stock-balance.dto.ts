export interface StockBalanceDTO {
  id: number;
  itemId?: number | null;
  itemName?: string | null;
  totalQuantity?: number | null;
  reservedQuantity?: number | null;
  unavailableQuantity?: number | null;
  availableQuantity?: number | null;
  minimumQuantity?: number | null;
  lowStock?: boolean;
}
