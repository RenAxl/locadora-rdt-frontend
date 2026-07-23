import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PhotoPreview } from 'src/app/core/utils/photo-preview.util';

import { CategoryMapper } from '../../mapper/category.mapper';
import { Category } from '../../models/Category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit, OnDestroy {
  category: Category = new Category({
    active: true,
  });

  selectedImage: File | null = null;
  selectedImageName?: string;
  imagePreviewUrl: SafeUrl | null = null;

  private subs: Subscription[] = [];
  private imagePreview: PhotoPreview;

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    sanitizer: DomSanitizer,
  ) {
    this.imagePreview = new PhotoPreview(sanitizer);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('categoryId');

    if (id != null) {
      const sub = this.categoryService.findById(id).subscribe({
        next: (data) => {
          this.category = CategoryMapper.fromDetailsDTO(data);
          this.loadCategoryImage(Number(id));
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err?.error?.message || 'Erro ao carregar categoria.',
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

    if (this.category.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const dto = CategoryMapper.toInsertDTO(this.category);

    const sub = this.categoryService.insert(dto).subscribe({
      next: (createdCategory) => {
        this.uploadImageOrFinish(
          createdCategory.id,
          'Categoria cadastrada com sucesso!',
          'Categoria cadastrada, mas falhou ao enviar a imagem.',
        );
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.message || 'Erro ao cadastrar categoria.',
        });
      },
    });

    this.subs.push(sub);
  }

  update(): void {
    if (!this.category.id) {
      return;
    }

    const dto = CategoryMapper.toUpdateDTO(this.category);

    const sub = this.categoryService.update(dto).subscribe({
      next: () => {
        this.uploadImageOrFinish(
          this.category.id,
          'Categoria atualizada com sucesso!',
          'Categoria atualizada, mas falhou ao enviar a imagem.',
        );
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.message || 'Erro ao atualizar categoria.',
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

  private loadCategoryImage(categoryId: number): void {
    const sub = this.categoryService.getCategoryImage(categoryId).subscribe({
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
    categoryId: number | undefined,
    successMessage: string,
    uploadErrorMessage: string,
  ): void {
    if (!categoryId || !this.selectedImage) {
      this.finishSuccess(successMessage);
      return;
    }

    const sub = this.categoryService
      .updateImage(categoryId, this.selectedImage)
      .subscribe({
        next: () => this.finishSuccess(successMessage),
        error: (err) => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Atenção',
            detail: err?.error?.message || uploadErrorMessage,
          });

          this.router.navigate(['/rental/categories']);
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

    this.category = new Category({ active: true });
    this.selectedImage = null;
    this.selectedImageName = undefined;
    this.imagePreviewUrl = null;

    this.router.navigate(['/rental/categories']);
  }
}
