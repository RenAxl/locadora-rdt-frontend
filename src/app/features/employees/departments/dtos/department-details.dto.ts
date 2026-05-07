export interface DepartmentDetailsDTO {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
}