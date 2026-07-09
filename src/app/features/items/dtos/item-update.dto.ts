export interface ItemUpdateDTO {
  id: number;
  name: string;
  categoryId?: number | null;
  rentalTypeId?: number | null;
  price?: number | null;
  quantity?: number | null;
}
