import { Address } from '../models/address';

export interface SupplierInsertDTO {
  name: string;
  tradeName: string;
  companyName: string;
  cnpj: string;
  address: Address;
  email?: string | null;
  phoneNumber?: string | null;
}
