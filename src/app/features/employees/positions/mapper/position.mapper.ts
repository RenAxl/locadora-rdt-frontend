import { Position } from '../models/Position';
import { PositionDTO } from '../dtos/position.dto';
import { PositionDetailsDTO } from '../dtos/position-details.dto';
import { PositionInsertDTO } from '../dtos/position-insert.dto';
import { PositionUpdateDTO } from '../dtos/position-update.dto';

export class PositionMapper {

  static fromDTO(dto: PositionDTO): Position {
    return new Position({
      id: dto.id,
      name: dto.name
    });
  }

  static fromDetailsDTO(dto: PositionDetailsDTO): Position {
    return new Position({
      id: dto.id,
      name: dto.name,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : null,
      createdBy: dto.createdBy,
      updatedBy: dto.updatedBy
    });
  }

  static toInsertDTO(position: Position): PositionInsertDTO {
    return {
      name: position.name
    };
  }

  static toUpdateDTO(position: Position): PositionUpdateDTO {
    return {
      name: position.name
    };
  }
}