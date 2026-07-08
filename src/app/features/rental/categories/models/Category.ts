export class Category {
  id?: number;
  name: string = '';
  active?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string | null;
  updatedBy?: string | null;

  constructor(init?: Partial<Category>) {
    Object.assign(this, init);
  }
}
