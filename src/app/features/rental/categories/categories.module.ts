import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { SharedModule } from 'src/app/shared/shared.module';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryDetailsModalComponent } from './components/category-details-modal/category-details-modal.component';
import { CategoryFormComponent } from './pages/category-form/category-form.component';
import { CategoryListComponent } from './pages/category-list/category-list.component';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryFormComponent,
    CategoryDetailsModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    SharedModule,
    CategoriesRoutingModule,
  ],
})
export class CategoriesModule {}
