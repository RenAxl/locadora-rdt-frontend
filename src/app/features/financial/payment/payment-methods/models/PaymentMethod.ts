export class PaymentMethod {
  id?: number;
  name: string = '';
  fee?: number | null;
  createdAt?: Date;
  updatedAt?: Date | null;
  createdBy?: string;
  updatedBy?: string | null;

  constructor(init?: Partial<PaymentMethod>) {
    Object.assign(this, init);
  }
}
