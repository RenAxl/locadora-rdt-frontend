export interface CustomerInsertDTO {
  name: string;
  cpf: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  active?: boolean;
}