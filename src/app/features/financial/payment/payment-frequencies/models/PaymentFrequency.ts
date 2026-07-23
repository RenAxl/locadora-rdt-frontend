export class PaymentFrequency {
  id?: number;
  frequency: string = '';
  days?: number | null;
  createdAt?: Date;
  updatedAt?: Date | null;
  createdBy?: string;
  updatedBy?: string | null;

  constructor(init?: Partial<PaymentFrequency>) {
    Object.assign(this, init);
  }
}
