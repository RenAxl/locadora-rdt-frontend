export interface ItemUnit {
  id: number;
  itemId: number;
  itemName: string;
  assetCode: string;
  serialNumber: string | null;
  status: string;
  conditionStatus: string;
  active: boolean;
}
