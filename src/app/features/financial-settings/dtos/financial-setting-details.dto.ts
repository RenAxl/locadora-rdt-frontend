import { FinancialSettingDTO } from './financial-setting.dto';

export interface FinancialSettingDetailsDTO extends FinancialSettingDTO {
  createdAt?: string;
  updatedAt?: string | null;
  createdBy?: string;
  updatedBy?: string | null;
}
