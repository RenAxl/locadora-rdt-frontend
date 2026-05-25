import { User } from '../models/user';

import { UserDTO } from '../dtos/user.dto';
import { UserDetailsDTO } from '../dtos/user-details.dto';
import { UserInsertDTO } from '../dtos/user-insert.dto';
import { UserUpdateDTO } from '../dtos/user-update.dto';

import { Role } from '../../roles/models/Role';
import { RoleDTO } from '../../roles/dtos/role.dto';

export class UserMapper {
  static toModel(dto: UserDTO): User {
    return new User({
      id: dto.id,

      name: dto.name || '',

      email: dto.email || '',

      active: dto.active ?? true,

      telephone: dto.telephone || '',

      address: dto.address,

      photoContentType: dto.photoContentType,

      roles:
        dto.roles?.map(
          (roleDto: RoleDTO) =>
            new Role({
              id: roleDto.id,
              authority: roleDto.authority,
            })
        ) || [],
    });
  }

  static toDetailsModel(dto: UserDetailsDTO): User {
    return new User({
      id: dto.id,

      name: dto.name || '',

      email: dto.email || '',

      active: dto.active ?? true,

      telephone: dto.telephone || '',

      address: dto.address,

      photoContentType: dto.photoContentType,

      createdAt: dto.createdAt,

      updatedAt: dto.updatedAt,

      createdBy: dto.createdBy,

      updatedBy: dto.updatedBy,

      roles:
        dto.roles?.map(
          (roleName: string) =>
            new Role({
              authority: roleName,
            })
        ) || [],
    });
  }

  static toInsertDTO(user: User): UserInsertDTO {
    return new UserInsertDTO({
      name: user.name,

      email: user.email,

      telephone: user.telephone,

      address: user.address,

      roleIds:
        user.roles
          ?.map((role) => role.id)
          .filter((id): id is number => id !== undefined) || [],
    });
  }

  static toUpdateDTO(user: User): UserUpdateDTO {
    return new UserUpdateDTO({
      id: user.id,

      name: user.name,

      email: user.email,

      active: user.active,

      telephone: user.telephone,

      address: user.address,

      roleIds:
        user.roles
          ?.map((role) => role.id)
          .filter((id): id is number => id !== undefined) || [],
    });
  }

  static toModelList(dtos: UserDTO[]): User[] {
    return dtos.map((dto) => this.toModel(dto));
  }

}