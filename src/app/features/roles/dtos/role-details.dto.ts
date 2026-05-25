import { PermissionDTO } from "../permissions/dtos/permission-dto";

export class RoleDetailsDTO {
  id?: number;
  authority: string = '';

  permissions: PermissionDTO[] = [];

  createdAt?: Date;
  updatedAt?: Date;

  createdBy?: string;
  updatedBy?: string;

  constructor(init?: Partial<RoleDetailsDTO>) {
    Object.assign(this, init);

    this.permissions =
      init?.permissions?.map(
        (permission) => new PermissionDTO(permission)
      ) || [];
  }
}