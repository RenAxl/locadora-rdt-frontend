export class Department {
  id?: number;
  name!: string;
  description?: string;
 createdAt?: Date;
  updatedAt?: Date | null;
  createdBy?: string;
  updatedBy?: string | null;

  constructor(init?: Partial<Department>) {
    Object.assign(this, init);
  }
}