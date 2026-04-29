export class Department {
  id?: number;
  name!: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;

  constructor(init?: Partial<Department>) {
    Object.assign(this, init);
  }
}