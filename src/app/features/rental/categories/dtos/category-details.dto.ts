export interface CategoryDetailsDTO {
  id: number;
  version?: number;
  name: string;
  active?: boolean;

  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}
