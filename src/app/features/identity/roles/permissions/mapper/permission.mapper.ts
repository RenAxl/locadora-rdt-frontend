import { PermissionDTO } from '../dtos/permission-dto';
import { Permission } from '../models/permission';


export class PermissionMapper {

  static toModel(dto: PermissionDTO): Permission {
    return {
      id: dto.id,
      name: dto.name,
      groupName: dto.groupName,
    };
  }

  static toDTO(model: Permission): PermissionDTO {
    return new PermissionDTO({
      id: model.id,
      name: model.name || '',
      groupName: model.groupName || '',
    });
  }

  static toModelList(dtos: PermissionDTO[]): Permission[] {
    return dtos.map(dto => this.toModel(dto));
  }

  static toDTOList(models: Permission[]): PermissionDTO[] {
    return models.map(model => this.toDTO(model));
  }
}