export class StockMovement {
  id?: number;
  itemId?: number;
  itemName?: string;
  type: string = 'ENTRY';
  quantity?: number | null;
  reason?: string | null;
  referenceType?: string | null;
  referenceId?: number | null;
  createdAt?: Date;
  createdBy?: string | null;

  constructor(init?: Partial<StockMovement>) {
    Object.assign(this, init);
  }
}
