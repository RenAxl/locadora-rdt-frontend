import { FinancialSettingDetailsDTO } from '../dtos/financial-setting-details.dto';
import { FinancialSettingUpdateDTO } from '../dtos/financial-setting-update.dto';
import { FinancialSettingDTO } from '../dtos/financial-setting.dto';
import { FinancialSetting } from '../models/FinancialSetting';

export class FinancialSettingMapper {
  static fromDTO(dto: FinancialSettingDTO): FinancialSetting {
    return new FinancialSetting({
      id: dto.id,
      defaultLateFeePercent: dto.defaultLateFeePercent,
      defaultLateInterestPercent: dto.defaultLateInterestPercent,
    });
  }

  static fromDetailsDTO(dto: FinancialSettingDetailsDTO): FinancialSetting {
    return new FinancialSetting({
      id: dto.id,
      defaultLateFeePercent: dto.defaultLateFeePercent,
      defaultLateInterestPercent: dto.defaultLateInterestPercent,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : null,
      createdBy: dto.createdBy,
      updatedBy: dto.updatedBy,
    });
  }

  static toUpdateDTO(setting: FinancialSetting): FinancialSettingUpdateDTO {
    return {
      defaultLateFeePercent: setting.defaultLateFeePercent ?? 0,
      defaultLateInterestPercent: setting.defaultLateInterestPercent ?? 0,
    };
  }
}
