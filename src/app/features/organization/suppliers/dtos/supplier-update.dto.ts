import { Address } from '../models/address';

export interface SupplierUpdateDTO {
  id: number;
  name: string;
  tradeName: string;
  companyName: string;
  cnpj: string;
  address: Address;
  email?: string | null;
  phoneNumber?: string | null;
}
