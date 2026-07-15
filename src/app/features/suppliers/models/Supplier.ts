import { Address } from './address';

export class Supplier {
  id?: number;
  name!: string;
  tradeName!: string;
  companyName!: string;
  cnpj!: string;
  address: Address = new Address();
  email?: string | null;
  phoneNumber?: string | null;
  image?: unknown;
  imageContentType?: string;

  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;

  constructor(init?: Partial<Supplier>) {
    Object.assign(this, init);
    this.address = new Address(init?.address);
  }
}
