export class Position {
  id?: number;
  name: string = '';

  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;

  constructor(init?: Partial<Position>) {
    Object.assign(this, init);
  }
}
