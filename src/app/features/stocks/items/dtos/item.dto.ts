export interface ItemDTO {
  id: number;
  name: string;
  description?: string | null;
  category?: { id: number; name: string; active?: boolean } | null;
  price?: number | null;
  active?: boolean;
}
