export interface SupplierDetailsDTO {
  id?: number;
  name: string;
  tradeName: string;
  companyName: string;
  cnpj: string;
  address: string;
  email?: string | null;
  phoneNumber?: string | null;
  imageContentType?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}
