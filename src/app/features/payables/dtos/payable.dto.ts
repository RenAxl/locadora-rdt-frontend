export interface PayableDTO {
  id: number;
  description: string;
  amount?: number | null;
  dueDate?: string | null;
  paymentDate?: string | null;
  createdDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  note?: string | null;
  fileName?: string | null;
  paid?: boolean | null;
  remainingBalance?: number | null;
  lateFee?: number | null;
  lateInterest?: number | null;
  discount?: number | null;
  fee?: number | null;
  subtotal?: number | null;
  currentAmountWithLateCharges?: number | null;
  overdueDays?: number | null;
  calculatedLateInterest?: number | null;
  calculatedLateFee?: number | null;
  residual?: boolean | null;
  canceled?: boolean | null;
  parentPayableId?: number | null;
  supplierId?: number | null;
  supplierName?: string | null;
  employeeId?: number | null;
  employeeName?: string | null;
  paymentMethodId?: number | null;
  paymentMethodName?: string | null;
  paymentFrequencyId?: number | null;
  paymentFrequency?: string | null;
  createdById?: number | null;
  createdByName?: string | null;
  paidById?: number | null;
  paidByName?: string | null;
}

export interface PayableSaveDTO {
  description?: string | null;
  amount?: number | null;
  dueDate?: string | null;
  paymentDate?: string | null;
  supplierId?: number | null;
  employeeId?: number | null;
  paymentMethodId?: number | null;
  paymentFrequencyId?: number | null;
  note?: string | null;
  fileName?: string | null;
}

export interface PayablePaymentDTO {
  paymentAmount?: number | null;
  paymentDate?: string | null;
  paymentMethodId?: number | null;
  subtotal?: number | null;
  fee?: number | null;
  lateInterest?: number | null;
  lateFee?: number | null;
  discount?: number | null;
}

export interface PayableInstallmentDTO {
  installments?: number | null;
  firstDueDate?: string | null;
}

export interface PayableReportDTO {
  totalItems: number;
  totalAmount: number;
  paidAmount: number;
  openAmount: number;
}

export interface PayableFileDTO {
  id: number;
  name: string;
  originalFileName: string;
  contentType: string;
  size: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  payableId: number;
}
