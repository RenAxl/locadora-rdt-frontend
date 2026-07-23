import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { PageResponse } from 'src/app/core/models/page-response';
import { Pagination } from 'src/app/core/models/Pagination';
import { ItemAvailability, ItemUnit, Rental, RentalItemUnit, RentalStatusHistory } from '../models/rental';
import { CustomerDTO } from 'src/app/features/organization/customers/dtos/customer.dto';
import { Address } from 'src/app/features/organization/customers/models/address';

export interface RentalFilter {
  number?: string;
  customer?: string;
  status?: string;
  rentalTypeId?: number | null;
  dateFrom?: string;
  dateTo?: string;
}

export interface ShippingPrice {
  price: number;
  distanceKm: number;
  deliveryAvailable: boolean;
}

@Injectable({ providedIn: 'root' })
export class RentalService {
  constructor(private http: HttpClient) {}

  list(pagination: Pagination, filter: RentalFilter): Observable<PageResponse<Rental>> {
    let params = new HttpParams()
      .set('page', pagination.page)
      .set('linesPerPage', pagination.linesPerPage)
      .set('direction', pagination.direction)
      .set('orderBy', pagination.orderBy);

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<PageResponse<Rental>>(API.RENTALS.ROOT, { params });
  }

  findById(id: number | string): Observable<Rental> {
    return this.http.get<Rental>(API.RENTALS.BY_ID(id));
  }

  findCurrentCustomer(): Observable<CustomerDTO> {
    return this.http.get<CustomerDTO>(API.RENTALS.CURRENT_CUSTOMER);
  }

  calculateShipping(address: Address): Observable<ShippingPrice> {
    return this.http.post<ShippingPrice>(API.RENTALS.CALCULATE_SHIPPING, address);
  }

  insert(rental: Rental): Observable<Rental> {
    return this.http.post<Rental>(API.RENTALS.ROOT, rental);
  }

  update(id: number, rental: Rental): Observable<Rental> {
    return this.http.put<Rental>(API.RENTALS.BY_ID(id), rental);
  }

  confirm(id: number): Observable<Rental> {
    return this.http.patch<Rental>(API.RENTALS.CONFIRM(id), {});
  }

  start(id: number, paymentMethodId: number): Observable<Rental> {
    return this.http.patch<Rental>(API.RENTALS.START(id), { paymentMethodId });
  }

  cancel(id: number): Observable<Rental> {
    return this.http.patch<Rental>(API.RENTALS.CANCEL(id), {});
  }

  findAvailability(itemId: number): Observable<ItemAvailability> {
    return this.http.get<ItemAvailability>(API.RENTALS.ITEM_AVAILABILITY(itemId));
  }

  findAvailableUnits(itemId: number): Observable<ItemUnit[]> {
    return this.http.get<ItemUnit[]>(API.RENTALS.AVAILABLE_UNITS(itemId));
  }

  findRentalUnits(id: number | string): Observable<RentalItemUnit[]> {
    return this.http.get<RentalItemUnit[]>(API.RENTALS.UNITS(id));
  }

  findHistory(id: number | string): Observable<RentalStatusHistory[]> {
    return this.http.get<RentalStatusHistory[]>(API.RENTALS.HISTORY(id));
  }

  receipt(id: number): Observable<Blob> {
    return this.http.get(API.RENTALS.RECEIPT(id), { responseType: 'blob' });
  }

  fiscalCoupon(id: number): Observable<Blob> {
    return this.http.get(API.RENTALS.FISCAL_COUPON(id), { responseType: 'blob' });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.RENTALS.BY_ID(id));
  }
}
