export class Customer {
  id?: number;
  name!: string;
  cpf!: string;
  email?: string;
  phone?: string;
  address?: string;
  active?: boolean;


  constructor(init?: Partial<Customer>) {
    Object.assign(this, init);
  }
}