export interface StockMovementDTO {
  id: number;
  itemId?: number | null;
  itemName?: string | null;
  type?: string | null;
  quantity?: number | null;
  reason?: string | null;
  referenceType?: string | null;
  referenceId?: number | null;
  createdAt?: string | null;
  createdBy?: string | null;
}
