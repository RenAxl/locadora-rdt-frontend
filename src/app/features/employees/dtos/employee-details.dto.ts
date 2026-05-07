export interface EmployeeDetailsDTO {
  id: number;
  name: string;
  employeeCode: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  salary?: number | null;
  hireDate?: string | null;
  terminationDate?: string | null;
  employmentType?: string | null;
  active?: boolean;
  photoContentType?: string | null;

  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;

  position?: { id: number; name: string } | null;
  department?: { id: number; name: string } | null;
}
