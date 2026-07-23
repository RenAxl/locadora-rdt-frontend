import { Address } from './address';

export class Customer {
  id?: number;
  name!: string;
  cpf!: string;
  email?: string | null;
  phone?: string | null;
  address: Address = new Address();
  active?: boolean;

  photo?: any;
  photoContentType?: string;

  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;

  constructor(init?: Partial<Customer>) {
    Object.assign(this, init);
    this.address = new Address(init?.address);
  }
}
