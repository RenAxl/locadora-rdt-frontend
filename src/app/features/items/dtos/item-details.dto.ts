export interface ItemDetailsDTO {
  id: number;
  version?: number;
  name: string;
  category?: { id: number; name: string; active?: boolean } | null;
  rentalType?: {
    id: number;
    name: string;
    type: string;
    active?: boolean;
  } | null;
  price?: number | null;
  quantity?: number | null;
  rentedQuantity?: number | null;
  active?: boolean;

  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}
