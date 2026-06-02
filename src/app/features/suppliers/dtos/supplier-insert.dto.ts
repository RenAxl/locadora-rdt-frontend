export interface SupplierInsertDTO {
  name: string;
  tradeName: string;
  companyName: string;
  cnpj: string;
  address: string;
  email?: string | null;
  phoneNumber?: string | null;
}
