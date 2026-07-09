import { Category } from '../../rental/categories/models/Category';
import { RentalType } from '../../rental/rentaltypes/models/RentalType';

export class Item {
  id?: number;
  name: string = '';
  category?: Category | null;
  rentalType?: RentalType | null;
  price?: number | null;
  quantity?: number | null;
  rentedQuantity?: number | null;
  active?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string | null;
  updatedBy?: string | null;

  constructor(init?: Partial<Item>) {
    Object.assign(this, init);
  }
}
