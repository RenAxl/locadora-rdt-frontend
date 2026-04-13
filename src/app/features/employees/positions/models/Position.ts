export class Position {
  id?: number;
  name!: string;
  createdAt?: Date;

  constructor(init?: Partial<Position>) {
    Object.assign(this, init);
  }
}