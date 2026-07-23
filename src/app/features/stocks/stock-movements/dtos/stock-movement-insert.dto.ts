export interface StockMovementInsertDTO {
  itemId?: number | null;
  type: string;
  quantity?: number | null;
  reason?: string | null;
  referenceType?: string | null;
  referenceId?: number | null;
}
