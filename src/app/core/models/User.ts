import { Role } from "./Role";


export class User {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  active?: boolean;
  telephone?: string;
  address?: string;
  photo?: string;
  date?: string;
  roles?: Role[];
}
