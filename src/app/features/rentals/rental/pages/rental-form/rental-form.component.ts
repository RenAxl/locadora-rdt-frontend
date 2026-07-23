import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Pagination } from 'src/app/core/models/Pagination';
import { CustomerDTO } from 'src/app/features/organization/customers/dtos/customer.dto';
import { ItemDTO } from 'src/app/features/stocks/items/dtos/item.dto';
import { ItemService } from 'src/app/features/stocks/items/services/item.service';
import { RentalTypeDTO } from '../../../rentaltypes/dtos/rental-type.dto';
import { RentalTypeService } from '../../../rentaltypes/services/rental-type.service';
import { Rental, RentalItem } from '../../models/rental';
import { RentalService } from '../../services/rental.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { RentalCartService } from '../../services/rental-cart.service';
import { Subscription } from 'rxjs';

@Component({ selector: 'app-rental-form', templateUrl: './rental-form.component.html', styleUrls: ['./rental-form.component.css'] })
export class RentalFormComponent implements OnInit, OnDestroy {
  rental: Rental = this.emptyRental();
  currentCustomer?: CustomerDTO;
  rentalTypes: RentalTypeDTO[] = [];
  availableItems: ItemDTO[] = [];
  selectedItemId?: number;
  editing = false;
  canChangePrice = false;
  calculatingShipping = false;
  shippingCalculated = false;
  shippingError = '';
  shippingDistanceKm?: number;
  private shippingTimer: any;
  private shippingSubscription?: Subscription;
  private validItemQuantities = new Map<number, number>();

  constructor(private rentalService: RentalService,
    private rentalTypeService: RentalTypeService,
    private itemService: ItemService, private route: ActivatedRoute, private router: Router,
    private messageService: MessageService, private authService: AuthService,
    private rentalCartService: RentalCartService) {}

  ngOnInit(): void {
    const canCreateRental = this.authService.hasAnyAuthority([
      'ROLE_ADMINISTRADOR',
      'ROLE_CLIENTE',
    ]);
    const id = this.route.snapshot.paramMap.get('rentalId');

    if (!id && !canCreateRental) {
      this.messageService.add({
        severity: 'error',
        detail: 'Usuário sem permissão para realizar uma locação.',
      });
      this.router.navigate(['/catalog']);
      return;
    }

    this.canChangePrice = this.authService.hasAuthority('RENTAL_PRICE_CHANGE')
      || this.authService.hasAuthority('ROLE_ADMINISTRADOR');
    this.loadOptions();
    if (id) {
      this.editing = true;
      this.rentalService.findById(id).subscribe((rental) => {
        this.rental = rental;
        this.rental.startDate = this.toLocalDate(rental.startDate);
        this.rental.expectedReturnDate = this.toLocalDate(rental.expectedReturnDate);
        this.saveValidItemQuantities();
      });
    } else {
      this.rental.items = this.rentalCartService.getItems();
      this.saveValidItemQuantities();
      this.calculate();
      this.loadCurrentCustomer();
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.shippingTimer);
    this.shippingSubscription?.unsubscribe();
  }

  addItem(): void {
    const item = this.availableItems.find((value) => value.id === Number(this.selectedItemId));
    if (!item) return;
    const existing = this.rental.items.find((value) => value.itemId === item.id);
    if (existing) existing.quantity++;
    else this.rental.items.push({ itemId: item.id, itemName: item.name, quantity: 1,
      unitPrice: Number(item.price || 0), discount: 0, additionalFee: 0 });
    this.selectedItemId = undefined;
    this.calculate(true);
  }

  removeItem(index: number): void { this.rental.items.splice(index, 1); this.calculate(true); }

  changeItemQuantity(item: RentalItem): void {
    const previousQuantity = this.validItemQuantities.get(item.itemId) || 1;
    const requestedQuantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
    item.quantity = requestedQuantity;

    this.rentalService.findAvailability(item.itemId).subscribe((availability) => {
      if (requestedQuantity > availability.availableQuantity) {
        item.quantity = previousQuantity;
        this.messageService.add({
          severity: 'warn',
          detail: `Não há quantidade suficiente do item ${item.itemName}. Disponível: ${availability.availableQuantity}.`,
        });
        this.calculate(true);
        return;
      }

      this.validItemQuantities.set(item.itemId, requestedQuantity);
      this.calculate(true);
    });
  }

  changeRentalType(rentalTypeId?: number): void {
    this.rental.rentalTypeId = rentalTypeId;
    this.calculateExpectedReturnDate();
    this.calculate();
  }

  changeStartDate(startDate: string): void {
    this.rental.startDate = startDate;
    this.calculateExpectedReturnDate();
  }

  calculate(recalculateShipping = false): void {
    const rentalDays = this.getRentalDays();
    this.rental.items.forEach((item) => item.subtotal = Math.max(0,
      item.quantity * Number(item.unitPrice || 0) * rentalDays
      - Number(item.discount || 0) + Number(item.additionalFee || 0)));
    this.rental.subtotal = this.rental.items.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
    this.rental.discount = 0;
    this.rental.totalAmount = Math.max(0, Number(this.rental.subtotal) - Number(this.rental.discount || 0)
      + Number(this.rental.shippingFee || 0) + Number(this.rental.additionalFee || 0));
    this.rental.remainingAmount = Math.max(0, Number(this.rental.totalAmount) - Number(this.rental.downPayment || 0));
    if (recalculateShipping) {
      this.scheduleShippingCalculation();
    }
  }

  getRentalDays(): number {
    const rentalType = this.rentalTypes.find(
      (type) => type.id === Number(this.rental.rentalTypeId),
    );
    return Math.max(1, Number(rentalType?.days) || 1);
  }

  save(): void {
    if (!this.rental.customerId || !this.rental.rentalTypeId || !this.rental.startDate || !this.rental.expectedReturnDate) {
      this.messageService.add({ severity: 'warn', detail: 'Informe cliente, tipo e período.' });
      return;
    }
    if (!this.editing && this.rental.items.length > 0 && !this.shippingCalculated) {
      this.messageService.add({ severity: 'warn', detail: 'Aguarde o cálculo do frete antes de salvar.' });
      return;
    }
    const payload: Rental = { ...this.rental, startDate: new Date(this.rental.startDate).toISOString(),
      expectedReturnDate: new Date(this.rental.expectedReturnDate).toISOString() };
    const request = this.editing && this.rental.id
      ? this.rentalService.update(this.rental.id, payload) : this.rentalService.insert(payload);
    request.subscribe(() => {
      if (!this.editing) {
        this.rentalCartService.clear();
      }
      this.messageService.add({ severity: 'success', detail: 'Locação realizada com sucesso!' });
      this.router.navigate(['/rentals']);
    });
  }

  private loadOptions(): void {
    const page = new Pagination(0, 100);
    this.rentalTypeService.list(page, '').subscribe((data) => {
      this.rentalTypes = data.content.filter((x) => x.active !== false);
      this.calculate();
    });
    this.itemService.list(page, '').subscribe((data) => this.availableItems = data.content.filter((x) => x.active !== false));
  }

  private loadCurrentCustomer(): void {
    this.rentalService.findCurrentCustomer().subscribe({
      next: (customer) => {
        this.currentCustomer = customer;
        this.rental.customerId = customer.id;
        this.rental.customerName = customer.name;
        this.rental.deliveryAddress = this.formatDeliveryAddress(customer);
        this.scheduleShippingCalculation();
      },
      error: () => {
        this.currentCustomer = undefined;
      },
    });
  }

  private emptyRental(): Rental { return { discount: 0, shippingFee: 0, additionalFee: 0, downPayment: 0, items: [] }; }

  private saveValidItemQuantities(): void {
    for (const item of this.rental.items) {
      this.validItemQuantities.set(item.itemId, item.quantity);
    }
  }
  private toLocalDate(value?: string): string { return value ? value.substring(0, 16) : ''; }

  private formatDeliveryAddress(customer: CustomerDTO): string {
    const address = customer.address;

    if (!address) {
      return '';
    }

    const streetAndNumber = [address.street, address.number].filter(Boolean).join(', ');
    const parts = [
      streetAndNumber,
      address.complement,
      address.neighborhood,
      address.city,
      address.state,
      address.zipCode,
    ];

    return parts.filter((part) => part && part.trim()).join(' - ');
  }

  private calculateExpectedReturnDate(): void {
    const rentalType = this.rentalTypes.find((type) => type.id === Number(this.rental.rentalTypeId));
    const days = Number(rentalType?.days);

    if (!rentalType || !this.rental.startDate || days < 1) {
      this.rental.expectedReturnDate = '';
      return;
    }

    const expectedDate = new Date(this.rental.startDate);
    expectedDate.setDate(expectedDate.getDate() + days);

    this.rental.expectedReturnDate = this.formatLocalDate(expectedDate);
  }

  private formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hour}:${minute}`;
  }

  private scheduleShippingCalculation(): void {
    if (this.editing) return;
    clearTimeout(this.shippingTimer);
    this.shippingSubscription?.unsubscribe();
    this.shippingCalculated = false;
    this.shippingError = '';
    this.shippingDistanceKm = undefined;
    this.shippingTimer = setTimeout(() => this.calculateShipping(), 400);
  }

  private calculateShipping(): void {
    const address = this.currentCustomer?.address;
    const quantity = this.rental.items.reduce((total, item) => total + Number(item.quantity || 0), 0);

    if (!address || !address.zipCode || quantity < 1) {
      this.rental.shippingFee = 0;
      this.shippingCalculated = quantity < 1;
      this.shippingError = address?.zipCode || quantity < 1 ? '' : 'O cliente não possui endereço completo cadastrado.';
      this.calculate();
      return;
    }

    this.calculatingShipping = true;
    this.shippingSubscription = this.rentalService.calculateShipping(address).subscribe({
      next: (result) => {
        this.shippingDistanceKm = Number(result.distanceKm);
        if (!result.deliveryAvailable) {
          this.rental.shippingFee = 0;
          this.calculatingShipping = false;
          this.shippingCalculated = false;
          this.shippingError = 'Não realizamos entregas acima de 40 km.';
          this.calculate();
          this.messageService.add({ severity: 'warn', detail: this.shippingError });
          return;
        }
        this.rental.shippingFee = Number(result.price || 0);
        this.calculatingShipping = false;
        this.shippingCalculated = true;
        this.shippingError = '';
        this.calculate();
      },
      error: (error) => {
        this.rental.shippingFee = 0;
        this.calculatingShipping = false;
        this.shippingCalculated = false;
        this.shippingDistanceKm = undefined;
        this.shippingError = error?.error?.message || 'Não foi possível calcular a distância da entrega.';
        this.calculate();
        this.messageService.add({
          severity: 'warn',
          detail: this.shippingError,
        });
      },
    });
  }
}
