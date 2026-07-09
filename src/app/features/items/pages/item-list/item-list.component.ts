import { Component, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, EMPTY } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { PhotoUrlRegistry } from 'src/app/core/utils/photo-preview.util';
import {
  addSelectedId,
  removeSelectedId,
} from 'src/app/core/utils/selection.util';

import { ItemMapper } from '../../mapper/item.mapper';
import { Item } from '../../models/Item';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})
export class ItemListComponent implements OnDestroy {
  items: Item[] = [];
  pagination: Pagination = new Pagination();
  totalElements: number = 0;
  filterName: string = '';

  @ViewChild('itemTable') grid!: Table;

  imageMap: { [key: number]: SafeUrl } = {};
  selectedItems: Item[] = [];
  selectedItemIds: number[] = [];
  detailsVisible = false;
  itemDetails: Item | null = null;

  private imageUrls: PhotoUrlRegistry;

  constructor(
    private itemService: ItemService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    sanitizer: DomSanitizer,
  ) {
    this.imageUrls = new PhotoUrlRegistry(sanitizer);
  }

  ngOnDestroy(): void {
    this.imageUrls.clear();
  }

  list(page: number = 0): void {
    this.pagination.page = page;

    this.itemService.list(this.pagination, this.filterName).subscribe((data) => {
      this.items = data.content.map(ItemMapper.fromDTO);
      this.totalElements = data.totalElements;
      this.loadImages();
    });
  }

  changePage(event: LazyLoadEvent): void {
    const page = event.first! / event.rows!;
    this.list(page);
  }

  searchItem(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(item: Item): void {
    if (!item.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.itemService.delete(item.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Item excluído com sucesso!',
          });
        });
      },
    });
  }

  deleteSelectedItems(): void {
    if (!this.selectedItemIds || this.selectedItemIds.length === 0) {
      return;
    }

    const ids = [...this.selectedItemIds];

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${ids.length} item(ns)?`,
      accept: () => {
        this.itemService.deleteAll(ids).subscribe(() => {
          this.selectedItemIds = [];
          this.selectedItems = [];
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Item(ns) excluído(s) com sucesso!',
          });
        });
      },
    });
  }

  changeActive(item: Item): void {
    if (!item.id) {
      return;
    }

    const newStatus = !item.active;

    this.itemService.changeActive(item.id, newStatus).subscribe({
      next: () => {
        item.active = newStatus;
        this.messageService.add({
          severity: 'success',
          detail: `Item ${newStatus ? 'ativado' : 'desativado'} com sucesso!`,
        });
      },
    });
  }

  openDetails(item: Item): void {
    const id = item.id;

    if (id == null) {
      return;
    }

    this.detailsVisible = true;
    this.itemDetails = null;

    this.itemService.findById(id).subscribe({
      next: (details) => {
        this.itemDetails = ItemMapper.fromDetailsDTO(details);
      },
    });
  }

  onRowSelect(event: any): void {
    this.selectedItemIds = addSelectedId(this.selectedItemIds, event?.data);
  }

  onRowUnselect(event: any): void {
    this.selectedItemIds = removeSelectedId(this.selectedItemIds, event?.data);
  }

  private loadImages(): void {
    this.imageUrls.clear();
    this.imageMap = {};

    this.items.forEach((item) => {
      if (!item.id) {
        return;
      }

      this.itemService
        .getItemImage(item.id)
        .pipe(
          catchError(() => {
            return EMPTY;
          }),
        )
        .subscribe((blob: Blob) => {
          if (!blob || blob.size === 0) {
            return;
          }

          const imageUrl = this.imageUrls.create(blob);

          if (imageUrl) {
            this.imageMap[item.id!] = imageUrl;
          }
        });
    });
  }
}
