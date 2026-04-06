export class CustomerFile {
  id?: number;
  name!: string;
  fileName?: string;
  contentType?: string;
  size?: number;
  createdAt?: Date;

  constructor(init?: Partial<CustomerFile>) {
    Object.assign(this, init);
  }
}