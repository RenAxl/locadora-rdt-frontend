import { Address } from '../models/address';

export interface SupplierDTO {
  id?: number;
  name: string;
  tradeName: string;
  companyName: string;
  cnpj: string;
  address: Address;
  email?: string | null;
  phoneNumber?: string | null;
  imageContentType?: string | null;
}
