export interface EmployeeDTO {
  id: number;
  name: string;
  employeeCode: string;
  email?: string;
  phone?: string;
  address?: string | null;
  salary?: number;
  hireDate?: string;
  employmentType?: string;
  active?: boolean;
  photoContentType?: string;

  position?: { id: number; name: string };
  department?: { id: number; name: string };
}
