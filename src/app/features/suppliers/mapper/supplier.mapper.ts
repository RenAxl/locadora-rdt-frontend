import { SupplierDetailsDTO } from '../dtos/supplier-details.dto';
import { SupplierInsertDTO } from '../dtos/supplier-insert.dto';
import { SupplierUpdateDTO } from '../dtos/supplier-update.dto';
import { SupplierDTO } from '../dtos/supplier.dto';
import { Supplier } from '../models/Supplier';

export class SupplierMapper {
  static fromDTO(dto: SupplierDTO): Supplier {
    return new Supplier({
      ...dto,
      email: SupplierMapper.normalizeEmail(dto.email),
      imageContentType: dto.imageContentType ?? undefined,
    });
  }

  static fromDetailsDTO(dto: SupplierDetailsDTO): Supplier {
    return new Supplier({
      ...dto,
      email: SupplierMapper.normalizeEmail(dto.email),
      imageContentType: dto.imageContentType ?? undefined,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      createdBy: dto.createdBy ?? undefined,
      updatedBy: dto.updatedBy ?? undefined,
    });
  }

  static toInsertDTO(supplier: Supplier): SupplierInsertDTO {
    return SupplierMapper.toWriteDTO(supplier);
  }

  static toUpdateDTO(supplier: Supplier): SupplierUpdateDTO {
    return { id: supplier.id!, ...SupplierMapper.toWriteDTO(supplier) };
  }

  private static normalizeEmail(email?: string | null): string | null | undefined {
    const markdownEmail = email?.match(/^\[([^\]]+)\]\(mailto:[^)]+\)$/);
    return markdownEmail?.[1] ?? email;
  }

  private static toWriteDTO(supplier: Supplier): SupplierInsertDTO {
    return {
      name: supplier.name,
      tradeName: supplier.tradeName,
      companyName: supplier.companyName,
      cnpj: supplier.cnpj,
      address: supplier.address,
      email: supplier.email ?? null,
      phoneNumber: supplier.phoneNumber ?? null,
    };
  }
}
