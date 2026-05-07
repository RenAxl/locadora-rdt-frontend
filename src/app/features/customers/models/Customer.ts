export class Customer {
  id?: number;
  name!: string;
  cpf!: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  active?: boolean;

  photo?: any;
  photoContentType?: string;

  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;

  constructor(init?: Partial<Customer>) {
    Object.assign(this, init);
  }
}
