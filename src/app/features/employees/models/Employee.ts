import { Department } from '../departments/models/Department';
import { Position } from '../positions/models/Position';

export class Employee {
  id?: number;
  name: string = '';
  employeeCode: string = '';
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  salary?: number | null;
  hireDate?: Date;
  terminationDate?: Date;
  employmentType?: string;
  active?: boolean;

  photo?: any;
  photoContentType?: string;

  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string | null;
  updatedBy?: string | null;

  position?: Position | null;
  department?: Department | null;

  constructor(init?: Partial<Employee>) {
    Object.assign(this, init);
  }
}
