export interface ItemDTO {
  id: number;
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
}
