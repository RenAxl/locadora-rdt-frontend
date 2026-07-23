export interface PaymentFrequencyDetailsDTO {
  id: number;
  frequency: string;
  days: number | null;
  createdAt?: string;
  updatedAt?: string | null;
  createdBy?: string;
  updatedBy?: string | null;
}
