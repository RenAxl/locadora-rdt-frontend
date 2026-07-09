export interface ItemDetailsDTO {
  id: number;
  version?: number;
  name: string;
  category?: { id: number; name: string; active?: boolean } | null;
  price?: number | null;
  active?: boolean;

  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}
