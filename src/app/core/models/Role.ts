import { Permission } from "./Permission";


export class Role {
  id?: number;
  authority?: string; 
  permissions?: Permission[];
}
