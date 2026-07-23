import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { PhotoUrlRegistry } from 'src/app/core/utils/photo-preview.util';
import { ItemMapper } from 'src/app/features/stocks/items/mapper/item.mapper';
import { Item } from 'src/app/features/stocks/items/models/Item';
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
  private imageUrls: PhotoUrlRegistry;

  constructor(
    private catalogService: CatalogService,
    private router: Router,
    sanitizer: DomSanitizer,
  ) {
    this.imageUrls = new PhotoUrlRegistry(sanitizer);
  }

  ngOnInit(): void {
    this.list();
  }

  ngOnDestroy(): void {
    this.imageUrls.clear();
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

    this.router.navigate(['/catalog', id]);
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

}
