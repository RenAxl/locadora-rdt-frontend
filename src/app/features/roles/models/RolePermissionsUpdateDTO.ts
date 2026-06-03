export class RolePermissionsUpdateDTO {
  permissionIds: number[] = [];

  constructor(init?: Partial<RolePermissionsUpdateDTO>) {
    Object.assign(this, init);
  }
}
