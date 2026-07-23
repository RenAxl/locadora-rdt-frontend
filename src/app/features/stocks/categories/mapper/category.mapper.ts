import { CategoryDetailsDTO } from '../dtos/category-details.dto';
import { CategoryInsertDTO } from '../dtos/category-insert.dto';
import { CategoryUpdateDTO } from '../dtos/category-update.dto';
import { CategoryDTO } from '../dtos/category.dto';
import { Category } from '../models/Category';

export class CategoryMapper {
  static fromDTO(dto: CategoryDTO): Category {
    return new Category({
      id: dto.id,
      name: dto.name,
      active: dto.active,
    });
  }

  static fromDetailsDTO(dto: CategoryDetailsDTO): Category {
    return new Category({
      id: dto.id,
      name: dto.name,
      active: dto.active,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      createdBy: dto.createdBy ?? undefined,
      updatedBy: dto.updatedBy ?? undefined,
    });
  }

  static toInsertDTO(category: Category): CategoryInsertDTO {
    return {
      name: category.name,
    };
  }

  static toUpdateDTO(category: Category): CategoryUpdateDTO {
    return {
      id: category.id!,
      name: category.name,
    };
  }
}
