export interface RentalTypeDetailsDTO {
  id: number;
  version?: number;
  name: string;
  type: string;
  active?: boolean;

  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}
