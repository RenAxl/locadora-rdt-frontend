import { Address } from '../models/address';

export interface CustomerDTO {
  id?: number;
  name: string;
  cpf: string;
  email?: string | null;
  phone?: string | null;
  address?: Address | null;
  active?: boolean;
  photoContentType?: string | null;

}
