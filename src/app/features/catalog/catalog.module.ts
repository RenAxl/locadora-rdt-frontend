import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';

import { SharedModule } from 'src/app/shared/shared.module';
import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogFilterComponent } from './components/catalog-filter/catalog-filter.component';
import { CatalogItemCardComponent } from './components/catalog-item-card/catalog-item-card.component';
import { CatalogListComponent } from './pages/catalog-list/catalog-list.component';
import { CatalogItemDetailsComponent } from './pages/catalog-item-details/catalog-item-details.component';

@NgModule({
  declarations: [
    CatalogListComponent,
    CatalogItemCardComponent,
    CatalogFilterComponent,
    CatalogItemDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    PaginatorModule,
    SharedModule,
    CatalogRoutingModule,
  ],
})
export class CatalogModule {}
