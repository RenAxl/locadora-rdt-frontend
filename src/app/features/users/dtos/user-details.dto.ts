import { RoleDTO } from '../../roles/dtos/role.dto';
import { Address } from '../models/address';

export class UserDetailsDTO {
  id?: number;

  name?: string;
  email?: string;

  active?: boolean;

  telephone?: string;
  address?: Address;

  photoContentType?: string;

  roles: Array<string | RoleDTO> = [];

  createdAt?: Date;
  updatedAt?: Date;

  createdBy?: string;
  updatedBy?: string;

  constructor(init?: Partial<UserDetailsDTO>) {
    Object.assign(this, init);

    this.roles = init?.roles || [];

    this.createdAt = init?.createdAt
      ? new Date(init.createdAt)
      : undefined;

    this.updatedAt = init?.updatedAt
      ? new Date(init.updatedAt)
      : undefined;
  }
}
