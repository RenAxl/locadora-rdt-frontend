import { RentalTypeDetailsDTO } from '../dtos/rental-type-details.dto';
import { RentalTypeInsertDTO } from '../dtos/rental-type-insert.dto';
import { RentalTypeUpdateDTO } from '../dtos/rental-type-update.dto';
import { RentalTypeDTO } from '../dtos/rental-type.dto';
import { RentalType } from '../models/RentalType';

export class RentalTypeMapper {
  static fromDTO(dto: RentalTypeDTO): RentalType {
    return new RentalType({
      id: dto.id,
      name: dto.name,
      type: dto.type,
      active: dto.active,
    });
  }

  static fromDetailsDTO(dto: RentalTypeDetailsDTO): RentalType {
    return new RentalType({
      id: dto.id,
      name: dto.name,
      type: dto.type,
      active: dto.active,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      createdBy: dto.createdBy ?? undefined,
      updatedBy: dto.updatedBy ?? undefined,
    });
  }

  static toInsertDTO(rentalType: RentalType): RentalTypeInsertDTO {
    return {
      name: rentalType.name,
      type: rentalType.type,
    };
  }

  static toUpdateDTO(rentalType: RentalType): RentalTypeUpdateDTO {
    return {
      id: rentalType.id!,
      name: rentalType.name,
      type: rentalType.type,
    };
  }
}
