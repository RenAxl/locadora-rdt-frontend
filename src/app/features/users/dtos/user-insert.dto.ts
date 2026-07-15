import { Address } from '../models/address';

export class UserInsertDTO {
  name: string = '';

  email: string = '';

  telephone: string = '';

  address: Address = new Address();

  roleIds: number[] = [];

  constructor(init?: Partial<UserInsertDTO>) {
    Object.assign(this, init);

    this.roleIds = init?.roleIds || [];
  }
}
