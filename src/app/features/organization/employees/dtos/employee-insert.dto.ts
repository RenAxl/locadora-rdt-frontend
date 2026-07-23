export interface EmployeeInsertDTO {
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
  positionId?: number | null;
  departmentId?: number | null;
}