export class Position {
  id?: number;
  name: string = '';

  createdAt?: Date;
  updatedAt?: Date | null;
  createdBy?: string;
  updatedBy?: string | null;

  constructor(init?: Partial<Position>) {
    Object.assign(this, init);
  }
}