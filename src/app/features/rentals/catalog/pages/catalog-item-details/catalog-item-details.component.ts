import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, EMPTY } from 'rxjs';
import { PhotoPreview } from 'src/app/core/utils/photo-preview.util';
import { ItemMapper } from 'src/app/features/stocks/items/mapper/item.mapper';
import { Item } from 'src/app/features/stocks/items/models/Item';
import { CatalogService } from '../../services/catalog.service';
import { MessageService } from 'primeng/api';
import { RentalCartService } from 'src/app/features/rentals/rental/services/rental-cart.service';
import { RentalService } from 'src/app/features/rentals/rental/services/rental.service';

@Component({
  selector: 'app-catalog-item-details',
  templateUrl: './catalog-item-details.component.html',
  styleUrls: ['./catalog-item-details.component.css'],
})
export class CatalogItemDetailsComponent implements OnInit, OnDestroy {
  item: Item | null = null;
  imageUrl?: SafeUrl;
  loading = true;
  itemNotFound = false;
  quantity = 1;
  selectedItemsQuantity = 0;

  private imagePreview: PhotoPreview;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalogService: CatalogService,
    private rentalCartService: RentalCartService,
    private rentalService: RentalService,
    private messageService: MessageService,
    sanitizer: DomSanitizer,
  ) {
    this.imagePreview = new PhotoPreview(sanitizer);
  }

  ngOnInit(): void {
    const itemId = Number(this.route.snapshot.paramMap.get('itemId'));

    if (!itemId) {
      this.loading = false;
      this.itemNotFound = true;
      return;
    }

    this.loadItem(itemId);
  }

  ngOnDestroy(): void {
    this.imagePreview.clear();
  }

  goBack(): void {
    this.router.navigate(['/catalog']);
  }

  addToRental(): void {
    if (!this.item?.id || this.item.price == null || this.quantity < 1) {
      return;
    }

    const itemId = this.item.id;
    const requestedQuantity = Math.floor(Number(this.quantity));
    const existingItem = this.rentalCartService.getItems().find((item) => item.itemId === itemId);
    const quantityInCart = existingItem ? existingItem.quantity : 0;
    const totalRequestedQuantity = quantityInCart + requestedQuantity;

    this.rentalService.findAvailability(itemId).subscribe((availability) => {
      if (totalRequestedQuantity > availability.availableQuantity) {
        this.messageService.add({
          severity: 'warn',
          detail: `Não há quantidade suficiente do item ${this.item?.name}. Disponível: ${availability.availableQuantity}.`,
        });
        return;
      }

      this.rentalCartService.addItem({
        itemId,
        itemName: this.item!.name,
        quantity: requestedQuantity,
        unitPrice: Number(this.item!.price),
        discount: 0,
        additionalFee: 0,
      });

      this.selectedItemsQuantity = this.rentalCartService.getTotalQuantity();
      this.quantity = 1;
      this.messageService.add({
        severity: 'success',
        detail: 'Item adicionado à locação.',
      });
    });
  }

  finishRental(): void {
    if (this.selectedItemsQuantity === 0) {
      this.messageService.add({
        severity: 'warn',
        detail: 'Adicione pelo menos um item.',
      });
      return;
    }

    this.rentalService.findCurrentCustomer().subscribe({
      next: () => this.router.navigate(['/rentals/create']),
      error: () => {
        this.messageService.add({
          severity: 'error',
          detail: 'Você não é um cliente da Locadora RDT.',
        });
      },
    });
  }

  private loadItem(itemId: number): void {
    this.catalogService.findById(itemId).subscribe({
      next: (dto) => {
        this.item = ItemMapper.fromDetailsDTO(dto);
        this.loading = false;
        this.loadImage(itemId);
        this.selectedItemsQuantity = this.rentalCartService.getTotalQuantity();
      },
      error: () => {
        this.loading = false;
        this.itemNotFound = true;
      },
    });
  }

  private loadImage(itemId: number): void {
    this.catalogService
      .getItemImage(itemId)
      .pipe(catchError(() => EMPTY))
      .subscribe((blob: Blob) => {
        if (blob && blob.size > 0) {
          this.imageUrl = this.imagePreview.create(blob) ?? undefined;
        }
      });
  }
}
