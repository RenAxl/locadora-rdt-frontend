export interface PaymentMethodDetailsDTO {
  id: number;
  name: string;
  fee: number | null;
  createdAt?: string;
  updatedAt?: string | null;
  createdBy?: string;
  updatedBy?: string | null;
}
