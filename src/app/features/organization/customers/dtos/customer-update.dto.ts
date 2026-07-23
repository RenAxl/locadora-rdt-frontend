import { Address } from '../models/address';

export interface CustomerUpdateDTO {
  id: number;
  name: string;
  cpf: string;
  email?: string | null;
  phone?: string | null;
  address: Address;
  active?: boolean;
}
