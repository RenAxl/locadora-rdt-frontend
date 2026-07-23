import { Address } from '../../features/identity/users/models/address';

export class Profile {
  name: string = '';
  email: string = '';
  telephone: string = '';
  address: Address = new Address();

  constructor(init?: Partial<Profile>) {
    Object.assign(this, init);
    this.address = new Address(init?.address);
  }
}
