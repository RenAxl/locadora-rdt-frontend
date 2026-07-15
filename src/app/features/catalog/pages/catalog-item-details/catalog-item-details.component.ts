import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, EMPTY } from 'rxjs';
import { PhotoPreview } from 'src/app/core/utils/photo-preview.util';
import { ItemMapper } from 'src/app/features/items/mapper/item.mapper';
import { Item } from 'src/app/features/items/models/Item';
import { CatalogService } from '../../services/catalog.service';

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

  private imagePreview: PhotoPreview;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalogService: CatalogService,
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

  private loadItem(itemId: number): void {
    this.catalogService.findById(itemId).subscribe({
      next: (dto) => {
        this.item = ItemMapper.fromDetailsDTO(dto);
        this.loading = false;
        this.loadImage(itemId);
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
