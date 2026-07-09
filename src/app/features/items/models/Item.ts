import { Category } from '../../rental/categories/models/Category';

export class Item {
  id?: number;
  name: string = '';
  category?: Category | null;
  price?: number | null;
  active?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string | null;
  updatedBy?: string | null;

  constructor(init?: Partial<Item>) {
    Object.assign(this, init);
  }
}
