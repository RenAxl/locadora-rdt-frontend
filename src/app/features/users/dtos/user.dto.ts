import { RoleDTO } from '../../roles/dtos/role.dto';
import { Address } from '../models/address';

export class UserDTO {
  id?: number;

  name?: string;
  email?: string;

  active?: boolean;

  telephone?: string;
  photoContentType?: string;
  address?: Address;

  roles: RoleDTO[] = [];

  constructor(init?: Partial<UserDTO>) {
    Object.assign(this, init);

    this.roles =
      init?.roles?.map((role) => new RoleDTO(role)) || [];
  }
}
