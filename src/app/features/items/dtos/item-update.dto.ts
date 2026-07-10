export interface ItemUpdateDTO {
  id: number;
  name: string;
  description: string;
  categoryId?: number | null;
  price?: number | null;
}
