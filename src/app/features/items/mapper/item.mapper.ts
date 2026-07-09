import { Category } from '../../rental/categories/models/Category';
import { RentalType } from '../../rental/rentaltypes/models/RentalType';
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
      price: dto.price ?? undefined,
      quantity: dto.quantity ?? undefined,
      rentedQuantity: dto.rentedQuantity ?? undefined,
      active: dto.active,
      category: dto.category
        ? new Category({
            id: dto.category.id,
            name: dto.category.name,
            active: dto.category.active,
          })
        : undefined,
      rentalType: dto.rentalType
        ? new RentalType({
            id: dto.rentalType.id,
            name: dto.rentalType.name,
            type: dto.rentalType.type,
            active: dto.rentalType.active,
          })
        : undefined,
    });
  }

  static fromDetailsDTO(dto: ItemDetailsDTO): Item {
    return new Item({
      id: dto.id,
      name: dto.name,
      price: dto.price ?? undefined,
      quantity: dto.quantity ?? undefined,
      rentedQuantity: dto.rentedQuantity ?? undefined,
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
      rentalType: dto.rentalType
        ? new RentalType({
            id: dto.rentalType.id,
            name: dto.rentalType.name,
            type: dto.rentalType.type,
            active: dto.rentalType.active,
          })
        : undefined,
    });
  }

  static toInsertDTO(item: Item): ItemInsertDTO {
    return {
      name: item.name,
      categoryId: item.category?.id ?? null,
      rentalTypeId: item.rentalType?.id ?? null,
      price: item.price ?? null,
      quantity: item.quantity ?? null,
    };
  }

  static toUpdateDTO(item: Item): ItemUpdateDTO {
    return {
      id: item.id!,
      name: item.name,
      categoryId: item.category?.id ?? null,
      rentalTypeId: item.rentalType?.id ?? null,
      price: item.price ?? null,
      quantity: item.quantity ?? null,
    };
  }
}
