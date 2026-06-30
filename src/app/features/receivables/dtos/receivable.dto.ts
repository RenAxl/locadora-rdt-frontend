export interface ReceivableDTO {
  id: number;
  description: string;
  amount?: number | null;
  dueDate?: string | null;
  paymentDate?: string | null;
  createdDate?: string | null;
  fileName?: string | null;
  paid?: boolean | null;
  remainingBalance?: number | null;
  customerId?: number | null;
  customerName?: string | null;
  paymentMethodId?: number | null;
  paymentMethodName?: string | null;
  paymentFrequencyId?: number | null;
  paymentFrequency?: string | null;
  createdById?: number | null;
  createdByName?: string | null;
  paidById?: number | null;
  paidByName?: string | null;
}
