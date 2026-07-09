export class StockBalance {
  id?: number;
  itemId?: number;
  itemName?: string;
  totalQuantity?: number;
  reservedQuantity?: number;
  unavailableQuantity?: number;
  availableQuantity?: number;
  minimumQuantity?: number;
  lowStock?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string | null;
  updatedBy?: string | null;

  constructor(init?: Partial<StockBalance>) {
    Object.assign(this, init);
  }
}
