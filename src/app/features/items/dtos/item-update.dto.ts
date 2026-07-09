export interface ItemUpdateDTO {
  id: number;
  name: string;
  categoryId?: number | null;
  price?: number | null;
}
