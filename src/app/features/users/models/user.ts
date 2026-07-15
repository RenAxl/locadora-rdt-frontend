import { Role } from '../../roles/models/Role';
import { Address } from './address';

export class User {
  id?: number;

  name: string = '';

  email: string = '';

  password?: string;

  active: boolean = true;

  telephone: string = '';

  address: Address = new Address();

  photo?: any;

  photoContentType?: string;

  createdAt?: Date;
  updatedAt?: Date;

  createdBy?: string;
  updatedBy?: string;

  roles: Role[] = [];

  constructor(init?: Partial<User>) {
    Object.assign(this, init);

    this.roles =
      init?.roles?.map((role) => new Role(role)) || [];

    this.address = new Address(init?.address);

    this.createdAt = init?.createdAt
      ? new Date(init.createdAt)
      : undefined;

    this.updatedAt = init?.updatedAt
      ? new Date(init.updatedAt)
      : undefined;
  }
}
