import { Employee } from "../models/Employee";


export class EmployeeInsertDTO {
  name!: string;
  employeeCode!: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  salary?: number | null;
  hireDate!: string | null;
  terminationDate?: string | null;
  employmentType!: string;
  active?: boolean;
  positionId!: number | null;
  departmentId!: number | null;

  private constructor() {}

  static fromEmployee(employee: Employee): EmployeeInsertDTO {
    const dto = new EmployeeInsertDTO();

    dto.name = employee.name?.trim();
    dto.employeeCode = employee.employeeCode?.trim();

    dto.email = this.normalizeString(employee.email);
    dto.phone = this.normalizeString(employee.phone);
    dto.address = this.normalizeString(employee.address);

    dto.salary = this.normalizeNumber(employee.salary);

    dto.hireDate = this.formatDate(employee.hireDate);
    dto.terminationDate = this.formatDate(employee.terminationDate);

    dto.employmentType = employee.employmentType?.trim() || '';
    dto.active = employee.active ?? true;

    dto.positionId = employee.position?.id ?? null;
    dto.departmentId = employee.department?.id ?? null;

    return dto;
  }

  private static normalizeString(value?: string): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }

  private static normalizeNumber(value?: number): number | null {
    if (value === null || value === undefined || value === ('' as any)) {
      return null;
    }

    return Number(value);
  }

  private static formatDate(value?: Date | string): string | null {
    if (!value) {
      return null;
    }

    if (typeof value === 'string') {
      return value;
    }

    return value.toISOString().split('T')[0];
  }
}