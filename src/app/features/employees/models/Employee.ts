import { Department } from '../departments/models/Department';
import { Position } from '../positions/models/Position';

export class Employee {
  id?: number;
  name!: string;
  employeeCode!: string;
  email?: string;
  phone?: string;
  address?: string;
  salary?: number;
  hireDate?: Date;
  terminationDate?: Date;
  employmentType?: string;
  active?: boolean;
  photo?: any;
  photoContentType?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number;
  updatedBy?: number;

  position?: Position;
  department?: Department;

  constructor(init?: Partial<Employee>) {
    Object.assign(this, init);
  }
}
