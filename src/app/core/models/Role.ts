import { Permission } from "../../features/roles/models/Permission";

export class Role {
  id?: number;
  authority?: string; 
  permissions?: Permission[];
}
