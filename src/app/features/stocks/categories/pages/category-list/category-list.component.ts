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

import { CategoryMapper } from '../../mapper/category.mapper';
import { Category } from '../../models/Category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent implements OnDestroy {
  categories: Category[] = [];

  pagination: Pagination = new Pagination();

  totalElements: number = 0;

  filterName: string = '';

  @ViewChild('categoryTable') grid!: Table;

  imageMap: { [key: number]: SafeUrl } = {};

  selectedCategories: Category[] = [];

  selectedCategoryIds: number[] = [];

  detailsVisible = false;

  categoryDetails: Category | null = null;

  private imageUrls: PhotoUrlRegistry;

  constructor(
    private categoryService: CategoryService,
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

    this.categoryService
      .list(this.pagination, this.filterName)
      .subscribe((data) => {
        this.categories = data.content.map(CategoryMapper.fromDTO);
        this.totalElements = data.totalElements;

        this.loadImages();
      });
  }

  changePage(event: LazyLoadEvent): void {
    const page = event.first! / event.rows!;
    this.list(page);
  }

  searchCategory(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(category: Category): void {
    if (!category.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.categoryService.delete(category.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Categoria excluída com sucesso!',
          });
        });
      },
    });
  }

  deleteSelectedCategories(): void {
    if (!this.selectedCategoryIds || this.selectedCategoryIds.length === 0) {
      return;
    }

    const ids = [...this.selectedCategoryIds];

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${ids.length} categoria(s)?`,
      accept: () => {
        this.categoryService.deleteAll(ids).subscribe(() => {
          this.selectedCategoryIds = [];
          this.selectedCategories = [];

          this.grid.reset();

          this.messageService.add({
            severity: 'success',
            detail: 'Categoria(s) excluída(s) com sucesso!',
          });
        });
      },
    });
  }

  changeActive(category: Category): void {
    if (!category.id) {
      return;
    }

    const newStatus = !category.active;

    this.categoryService.changeActive(category.id, newStatus).subscribe({
      next: () => {
        category.active = newStatus;

        this.messageService.add({
          severity: 'success',
          detail: `Categoria ${
            newStatus ? 'ativada' : 'desativada'
          } com sucesso!`,
        });
      },
    });
  }

  openDetails(category: Category): void {
    const id = category.id;

    if (id == null) {
      return;
    }

    this.detailsVisible = true;
    this.categoryDetails = null;

    this.categoryService.findById(id).subscribe({
      next: (details) => {
        this.categoryDetails = CategoryMapper.fromDetailsDTO(details);
      },
    });
  }

  onRowSelect(event: any): void {
    this.selectedCategoryIds = addSelectedId(
      this.selectedCategoryIds,
      event?.data,
    );
  }

  onRowUnselect(event: any): void {
    this.selectedCategoryIds = removeSelectedId(
      this.selectedCategoryIds,
      event?.data,
    );
  }

  private loadImages(): void {
    this.imageUrls.clear();
    this.imageMap = {};

    this.categories.forEach((category) => {
      if (!category.id) {
        return;
      }

      this.categoryService
        .getCategoryImage(category.id)
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
            this.imageMap[category.id!] = imageUrl;
          }
        });
    });
  }
}
