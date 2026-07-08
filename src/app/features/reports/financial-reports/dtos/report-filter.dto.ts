export interface ReportFilterDTO {
  search?: string;
  startDate?: string | null;
  endDate?: string | null;
  status?: string;
  periodType?: string;
  customerId?: number | null;
  supplierId?: number | null;
  employeeId?: number | null;
  paymentMethodId?: number | null;
  minimumAmount?: number | null;
  maximumAmount?: number | null;
  year?: number | null;
}
