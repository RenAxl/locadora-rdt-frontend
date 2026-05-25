import { Permission } from '../permissions/models/permission';

export class Role {
  id?: number;
  authority: string = '';
  permissionsCount?: number;

  permissions: Permission[] = [];

  createdAt?: Date;
  updatedAt?: Date;

  createdBy?: string;
  updatedBy?: string;

  constructor(init?: Partial<Role>) {
    Object.assign(this, init);
  }
}
