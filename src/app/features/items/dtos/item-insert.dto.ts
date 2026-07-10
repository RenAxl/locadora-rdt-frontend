export interface ItemInsertDTO {
  name: string;
  description: string;
  categoryId?: number | null;
  price?: number | null;
}
