import { RoleDTO } from '../../roles/dtos/role.dto';

export class UserDTO {
  id?: number;

  name?: string;
  email?: string;

  active?: boolean;

  telephone?: string;
  photoContentType?: string;
  address?: string;

  roles: RoleDTO[] = [];

  constructor(init?: Partial<UserDTO>) {
    Object.assign(this, init);

    this.roles =
      init?.roles?.map((role) => new RoleDTO(role)) || [];
  }
}