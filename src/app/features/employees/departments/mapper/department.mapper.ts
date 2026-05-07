import { Department } from '../models/Department';
import { DepartmentDTO } from '../dtos/department.dto';
import { DepartmentDetailsDTO } from '../dtos/department-details.dto';
import { DepartmentInsertDTO } from '../dtos/department-insert.dto';
import { DepartmentUpdateDTO } from '../dtos/department-update.dto';

export class DepartmentMapper {

  static fromDTO(dto: DepartmentDTO): Department {
    return new Department({
      id: dto.id,
      name: dto.name
    });
  }

  static fromDetailsDTO(dto: DepartmentDetailsDTO): Department {
    return new Department({
      id: dto.id,
      name: dto.name,
      description: dto.description || '',
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : null,
      createdBy: dto.createdBy,
      updatedBy: dto.updatedBy
    });
  }

  static toInsertDTO(department: Department): DepartmentInsertDTO {
    return {
      name: department.name,
      description: department.description || null
    };
  }

  static toUpdateDTO(department: Department): DepartmentUpdateDTO {
    return {
      name: department.name,
      description: department.description || null
    };
  }
}
