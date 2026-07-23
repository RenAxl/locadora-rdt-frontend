export class RentalType {
  id?: number;
  name: string = '';
  type: string = '';
  days?: number;
  active?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string | null;
  updatedBy?: string | null;

  constructor(init?: Partial<RentalType>) {
    Object.assign(this, init);
  }
}
