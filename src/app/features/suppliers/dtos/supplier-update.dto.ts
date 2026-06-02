export interface SupplierUpdateDTO {
  id: number;
  name: string;
  tradeName: string;
  companyName: string;
  cnpj: string;
  address: string;
  email?: string | null;
  phoneNumber?: string | null;
}
