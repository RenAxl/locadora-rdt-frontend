import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { PhotoPreview } from 'src/app/core/utils/photo-preview.util';

import { CategoryMapper } from '../../../categories/mapper/category.mapper';
import { Category } from '../../../categories/models/Category';
import { CategoryService } from '../../../categories/services/category.service';
import { ItemMapper } from '../../mapper/item.mapper';
import { Item } from '../../models/Item';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css'],
})
export class ItemFormComponent implements OnInit, OnDestroy {
  item: Item = new Item();

  categories: Category[] = [];

  selectedImage: File | null = null;
  selectedImageName?: string;
  imagePreviewUrl: SafeUrl | null = null;

  private subs: Subscription[] = [];
  private imagePreview: PhotoPreview;

  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    sanitizer: DomSanitizer,
  ) {
    this.imagePreview = new PhotoPreview(sanitizer);
  }

  ngOnInit(): void {
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('itemId');

    if (id != null) {
      const sub = this.itemService.findById(id).subscribe({
        next: (data) => {
          this.item = ItemMapper.fromDetailsDTO(data);
          this.loadItemImage(Number(id));
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err?.error?.message || 'Erro ao carregar item.',
          });
        },
      });

      this.subs.push(sub);
    }
  }

  ngOnDestroy(): void {
    this.imagePreview.clear();
    this.subs.forEach((s) => s.unsubscribe());
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.item.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const dto = ItemMapper.toInsertDTO(this.item);

    const sub = this.itemService.insert(dto).subscribe({
      next: (createdItem) => {
        this.uploadImageOrFinish(
          createdItem.id,
          'Item cadastrado com sucesso!',
          'Item cadastrado, mas falhou ao enviar a imagem.',
        );
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.message || 'Erro ao cadastrar item.',
        });
      },
    });

    this.subs.push(sub);
  }

  update(): void {
    if (!this.item.id) {
      return;
    }

    const dto = ItemMapper.toUpdateDTO(this.item);

    const sub = this.itemService.update(dto).subscribe({
      next: () => {
        this.uploadImageOrFinish(
          this.item.id,
          'Item atualizado com sucesso!',
          'Item atualizado, mas falhou ao enviar a imagem.',
        );
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.message || 'Erro ao atualizar item.',
        });
      },
    });

    this.subs.push(sub);
  }

  onImageSelected(event: any): void {
    const file = event?.target?.files?.[0] ?? null;

    this.selectedImage = file;
    this.selectedImageName = file?.name ?? undefined;
    this.imagePreviewUrl = file ? this.imagePreview.create(file) : null;
  }

  compareById(item1: any, item2: any): boolean {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  }

  private loadCategories(): void {
    const pagination = new Pagination(0, 1000, 'ASC', 'name');

    const sub = this.categoryService.list(pagination, '').subscribe({
      next: (response) => {
        this.categories = (response?.content ?? []).map(CategoryMapper.fromDTO);
      },
      error: () => {
        this.categories = [];
        this.messageService.add({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Não foi possível carregar as categorias.',
        });
      },
    });

    this.subs.push(sub);
  }

  private loadItemImage(itemId: number): void {
    const sub = this.itemService.getItemImage(itemId).subscribe({
      next: (blob) => {
        this.imagePreviewUrl = this.imagePreview.create(blob);
      },
      error: () => {
        this.imagePreviewUrl = null;
      },
    });

    this.subs.push(sub);
  }

  private uploadImageOrFinish(
    itemId: number | undefined,
    successMessage: string,
    uploadErrorMessage: string,
  ): void {
    if (!itemId || !this.selectedImage) {
      this.finishSuccess(successMessage);
      return;
    }

    const sub = this.itemService.updateImage(itemId, this.selectedImage).subscribe({
      next: () => this.finishSuccess(successMessage),
      error: (err) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Atenção',
          detail: err?.error?.message || uploadErrorMessage,
        });

        this.router.navigate(['/items']);
      },
    });

    this.subs.push(sub);
  }

  private finishSuccess(detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail,
    });

    this.item = new Item();
    this.selectedImage = null;
    this.selectedImageName = undefined;
    this.imagePreviewUrl = null;

    this.router.navigate(['/items']);
  }
}
