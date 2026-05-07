export interface CustomerDetailsDTO {
  id?: number;
  name: string;
  cpf: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  active?: boolean;
  photoContentType?: string | null;

  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}
