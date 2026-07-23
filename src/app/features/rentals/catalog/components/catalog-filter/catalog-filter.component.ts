import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Pagination } from 'src/app/core/models/Pagination';
import { CategoryMapper } from 'src/app/features/stocks/categories/mapper/category.mapper';
import { Category } from 'src/app/features/stocks/categories/models/Category';
import { CategoryService } from 'src/app/features/stocks/categories/services/category.service';

export interface CatalogFilter {
  name: string;
  categoryId?: number | null;
}

@Component({
  selector: 'app-catalog-filter',
  templateUrl: './catalog-filter.component.html',
  styleUrls: ['./catalog-filter.component.css'],
})
export class CatalogFilterComponent implements OnInit {
  @Output() search = new EventEmitter<CatalogFilter>();

  nameFilter: string = '';
  categoryId: number | null = null;
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  searchCatalog(): void {
    this.search.emit({
      name: this.nameFilter,
      categoryId: this.categoryId ?? null,
    });
  }

  formClear(): void {
    this.nameFilter = '';
    this.categoryId = null;
    this.searchCatalog();
  }

  private loadCategories(): void {
    const pagination = new Pagination(0, 1000, 'ASC', 'name');

    this.categoryService.list(pagination, '').subscribe({
      next: (response) => {
        this.categories = (response?.content ?? []).map(CategoryMapper.fromDTO);
      },
      error: () => {
        this.categories = [];
      },
    });
  }
}
