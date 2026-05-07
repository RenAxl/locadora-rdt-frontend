import { Employee } from '../models/Employee';
import { EmployeeDTO } from '../dtos/employee.dto';
import { EmployeeDetailsDTO } from '../dtos/employee-details.dto';
import { EmployeeInsertDTO } from '../dtos/employee-insert.dto';
import { EmployeeUpdateDTO } from '../dtos/employee-update.dto';
import { Position } from '../positions/models/Position';
import { Department } from '../departments/models/Department';

export class EmployeeMapper {
  static fromDTO(dto: EmployeeDTO): Employee {
    return new Employee({
      id: dto.id,
      name: dto.name,
      employeeCode: dto.employeeCode,
      email: dto.email ?? undefined,
      phone: dto.phone ?? undefined,
      address: dto.address ?? undefined,
      salary: dto.salary ?? undefined,
      hireDate: dto.hireDate ? new Date(dto.hireDate) : undefined,
      employmentType: dto.employmentType ?? undefined,
      active: dto.active,
      photoContentType: dto.photoContentType ?? undefined,
      position: dto.position
        ? new Position({
            id: dto.position.id,
            name: dto.position.name,
          })
        : undefined,
      department: dto.department
        ? new Department({
            id: dto.department.id,
            name: dto.department.name,
          })
        : undefined,
    });
  }

  static fromDetailsDTO(dto: EmployeeDetailsDTO): Employee {
    return new Employee({
      id: dto.id,
      name: dto.name,
      employeeCode: dto.employeeCode,
      email: dto.email ?? undefined,
      phone: dto.phone ?? undefined,
      address: dto.address ?? undefined,
      salary: dto.salary ?? undefined,
      hireDate: dto.hireDate ? new Date(dto.hireDate) : undefined,
      terminationDate: dto.terminationDate
        ? new Date(dto.terminationDate)
        : undefined,
      employmentType: dto.employmentType ?? undefined,
      active: dto.active,
      photoContentType: dto.photoContentType ?? undefined,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      createdBy: dto.createdBy ?? undefined,
      updatedBy: dto.updatedBy ?? undefined,
      position: dto.position
        ? new Position({
            id: dto.position.id,
            name: dto.position.name,
          })
        : undefined,
      department: dto.department
        ? new Department({
            id: dto.department.id,
            name: dto.department.name,
          })
        : undefined,
    });
  }

  static toInsertDTO(employee: Employee): EmployeeInsertDTO {
    return {
      name: employee.name,
      employeeCode: employee.employeeCode,
      email: employee.email ?? null,
      phone: employee.phone ?? null,
      address: employee.address ?? null,
      salary: employee.salary ?? null,
      hireDate: this.toDateString(employee.hireDate),
      terminationDate: this.toDateString(employee.terminationDate),
      employmentType: employee.employmentType ?? null,
      active: employee.active ?? true,
      positionId: employee.position?.id ?? null,
      departmentId: employee.department?.id ?? null,
    };
  }

  static toUpdateDTO(employee: Employee): EmployeeUpdateDTO {
    return {
      id: employee.id!,
      name: employee.name,
      employeeCode: employee.employeeCode,
      email: employee.email ?? null,
      phone: employee.phone ?? null,
      address: employee.address ?? null,
      salary: employee.salary ?? null,
      hireDate: this.toDateString(employee.hireDate),
      terminationDate: this.toDateString(employee.terminationDate),
      employmentType: employee.employmentType ?? null,
      active: employee.active ?? true,
      positionId: employee.position?.id ?? null,
      departmentId: employee.department?.id ?? null,
    };
  }

  private static toDateString(date?: Date | string): string | null {
    if (!date) {
      return null;
    }

    if (typeof date === 'string') {
      return date.substring(0, 10);
    }

    return date.toISOString().substring(0, 10);
  }
}
