import { RoleDetailsDTO } from "../dtos/role-details.dto";
import { RoleInsertDTO } from "../dtos/role-insert.dto";
import { RoleDTO } from "../dtos/role.dto";
import { Role } from "../models/Role";
import { RolePermissionsUpdateDTO } from "../models/RolePermissionsUpdateDTO";
import { PermissionMapper } from "../permissions/mapper/permission.mapper";

export class RoleMapper {

  static fromDTO(dto: RoleDTO): Role {
    return new Role({
      id: dto.id,
      authority: dto.authority,
      permissionsCount: dto.permissionsCount,

      permissions: PermissionMapper.toModelList(
        dto.permissions || []
      ),
    });
  }

  static fromDetailsDTO(dto: RoleDetailsDTO): Role {
    return new Role({
      id: dto.id,
      authority: dto.authority,

      permissions: PermissionMapper.toModelList(
        dto.permissions || []
      ),

      createdAt: dto.createdAt
        ? new Date(dto.createdAt)
        : undefined,

      updatedAt: dto.updatedAt
        ? new Date(dto.updatedAt)
        : undefined,

      createdBy: dto.createdBy ?? undefined,
      updatedBy: dto.updatedBy ?? undefined,
    });
  }

  static toInsertDTO(role: Role): RoleInsertDTO {
    return {
      authority: role.authority,
    };
  }

  static toPermissionsUpdateDTO(permissionIds: Set<number>): RolePermissionsUpdateDTO {
  return new RolePermissionsUpdateDTO({
    permissionIds: Array.from(permissionIds.values()),
  });
}

}