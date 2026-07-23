import { Address } from '../../../organization/customers/models/address';

export class SystemSetting {
  id?: number;
  companyName = '';
  address = new Address();

  constructor(init?: Partial<SystemSetting>) {
    Object.assign(this, init);
    this.address = new Address(init?.address || undefined);
  }
}
