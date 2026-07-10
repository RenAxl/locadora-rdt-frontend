import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, EMPTY } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import {
  PhotoPreview,
  PhotoUrlRegistry,
} from 'src/app/core/utils/photo-preview.util';
import { ItemMapper } from 'src/app/features/items/mapper/item.mapper';
import { Item } from 'src/app/features/items/models/Item';
import { CatalogFilter } from '../../components/catalog-filter/catalog-filter.component';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.css'],
})
export class CatalogListComponent implements OnInit, OnDestroy {
  items: Item[] = [];
  pagination: Pagination = new Pagination(0, 8);
  totalElements: number = 0;
  filterName: string = '';
  filterCategoryId?: number | null;
  imageMap: { [key: number]: SafeUrl } = {};
  detailsVisible = false;
  itemDetails: Item | null = null;
  detailsImageUrl?: SafeUrl;

  private imageUrls: PhotoUrlRegistry;
  private detailsImage: PhotoPreview;

  constructor(
    private catalogService: CatalogService,
    sanitizer: DomSanitizer,
  ) {
    this.imageUrls = new PhotoUrlRegistry(sanitizer);
    this.detailsImage = new PhotoPreview(sanitizer);
  }

  ngOnInit(): void {
    this.list();
  }

  ngOnDestroy(): void {
    this.imageUrls.clear();
    this.detailsImage.clear();
  }

  list(page: number = 0): void {
    this.pagination.page = page;
    this.pagination.linesPerPage = 8;

    this.catalogService
      .list(this.pagination, this.filterName, this.filterCategoryId)
      .subscribe((data) => {
        this.items = data.content.map(ItemMapper.fromDTO);
        this.totalElements = data.totalElements;
        this.loadImages();
      });
  }

  changePage(event: any): void {
    const page = event.page ?? 0;
    this.list(page);
  }

  searchCatalog(filter: CatalogFilter): void {
    this.filterName = filter.name;
    this.filterCategoryId = filter.categoryId ?? null;
    this.list();
  }

  openDetails(item: Item): void {
    const id = item.id;

    if (id == null) {
      return;
    }

    this.detailsVisible = true;
    this.itemDetails = null;

    this.catalogService.findById(id).subscribe({
      next: (details) => {
        this.itemDetails = ItemMapper.fromDetailsDTO(details);
        this.loadDetailsImage(id);
      },
    });
  }

  closeDetails(): void {
    this.detailsVisible = false;
    this.itemDetails = null;
    this.detailsImageUrl = undefined;
    this.detailsImage.clear();
  }

  getActiveLabel(active?: boolean): string {
    if (active === undefined || active === null) {
      return '-';
    }

    return active ? 'Sim' : 'Não';
  }

  private loadImages(): void {
    this.imageUrls.clear();
    this.imageMap = {};

    this.items.forEach((item) => {
      if (!item.id) {
        return;
      }

      this.catalogService
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

  private loadDetailsImage(id: number): void {
    this.detailsImageUrl = undefined;
    this.detailsImage.clear();

    this.catalogService
      .getItemImage(id)
      .pipe(
        catchError(() => {
          return EMPTY;
        }),
      )
      .subscribe((blob: Blob) => {
        if (!blob || blob.size === 0) {
          return;
        }

        this.detailsImageUrl = this.detailsImage.create(blob) ?? undefined;
      });
  }
}
