import { CustomerDetailsDTO } from '../dtos/customer-details.dto';
import { CustomerInsertDTO } from '../dtos/customer-insert.dto';
import { CustomerUpdateDTO } from '../dtos/customer-update.dto';
import { CustomerDTO } from '../dtos/customer.dto';
import { Customer } from '../models/Customer';

export class CustomerMapper {
  static fromDTO(dto: CustomerDTO): Customer {
    return new Customer({
      id: dto.id,
      name: dto.name,
      cpf: dto.cpf ?? undefined,
      email: dto.email ?? undefined,
      phone: dto.phone ?? undefined,
      address: dto.address ?? undefined,
      active: dto.active,
      photoContentType: dto.photoContentType ?? undefined,
    });
  }

  static fromDetailsDTO(dto: CustomerDetailsDTO): Customer {
    return new Customer({
      id: dto.id,
      name: dto.name,
      cpf: dto.cpf ?? undefined,
      email: dto.email ?? undefined,
      phone: dto.phone ?? undefined,
      address: dto.address ?? undefined,
      active: dto.active,
      photoContentType: dto.photoContentType ?? undefined,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      createdBy: dto.createdBy ?? undefined,
      updatedBy: dto.updatedBy ?? undefined,
    });
  }

  static toInsertDTO(customer: Customer): CustomerInsertDTO {
    return {
      name: customer.name,
      cpf: customer.cpf,
      email: customer.email ?? null,
      phone: customer.phone ?? null,
      address: customer.address ?? null,
      active: customer.active ?? true,
    };
  }

  static toUpdateDTO(customer: Customer): CustomerUpdateDTO {
    return {
      id: customer.id!,
      name: customer.name,
      cpf: customer.cpf,
      email: customer.email ?? null,
      phone: customer.phone ?? null,
      address: customer.address ?? null,
      active: customer.active ?? true,
    };
  }
}
