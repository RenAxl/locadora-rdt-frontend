export class PermissionDTO {
  id?: number;
  name: string = '';
  groupName: string = '';

  constructor(init?: Partial<PermissionDTO>) {
    Object.assign(this, init);
  }
}