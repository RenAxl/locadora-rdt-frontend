export interface CustomerDTO {
  id?: number;
  name: string;
  cpf: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  active?: boolean;
  photoContentType?: string | null;

}