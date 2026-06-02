export class Supplier {
  id?: number;
  name!: string;
  tradeName!: string;
  companyName!: string;
  cnpj!: string;
  address!: string;
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
  }
}
