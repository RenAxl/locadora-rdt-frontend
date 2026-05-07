export interface CustomerUpdateDTO {
  id: number;
  name: string;
  cpf: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  active?: boolean;
}
