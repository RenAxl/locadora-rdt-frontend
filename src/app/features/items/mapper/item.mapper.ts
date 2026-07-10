import { Category } from '../../rental/categories/models/Category';
import { ItemDetailsDTO } from '../dtos/item-details.dto';
import { ItemInsertDTO } from '../dtos/item-insert.dto';
import { ItemUpdateDTO } from '../dtos/item-update.dto';
import { ItemDTO } from '../dtos/item.dto';
import { Item } from '../models/Item';

export class ItemMapper {
  static fromDTO(dto: ItemDTO): Item {
    return new Item({
      id: dto.id,
      name: dto.name,
      description: dto.description ?? '',
      price: dto.price ?? undefined,
      active: dto.active,
      category: dto.category
        ? new Category({
            id: dto.category.id,
            name: dto.category.name,
            active: dto.category.active,
        })
        : undefined,
    });
  }

  static fromDetailsDTO(dto: ItemDetailsDTO): Item {
    return new Item({
      id: dto.id,
      name: dto.name,
      description: dto.description ?? '',
      price: dto.price ?? undefined,
      active: dto.active,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      createdBy: dto.createdBy ?? undefined,
      updatedBy: dto.updatedBy ?? undefined,
      category: dto.category
        ? new Category({
            id: dto.category.id,
            name: dto.category.name,
            active: dto.category.active,
        })
        : undefined,
    });
  }

  static toInsertDTO(item: Item): ItemInsertDTO {
    return {
      name: item.name,
      description: item.description,
      categoryId: item.category?.id ?? null,
      price: item.price ?? null,
    };
  }

  static toUpdateDTO(item: Item): ItemUpdateDTO {
    return {
      id: item.id!,
      name: item.name,
      description: item.description,
      categoryId: item.category?.id ?? null,
      price: item.price ?? null,
    };
  }
}
