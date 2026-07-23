import { PermissionDTO } from "../permissions/dtos/permission-dto";

export class RoleDTO {
  id?: number;
  authority: string = '';
  permissionsCount?: number;

  permissions: PermissionDTO[] = [];

  constructor(init?: Partial<RoleDTO>) {
    Object.assign(this, init);
  }
}