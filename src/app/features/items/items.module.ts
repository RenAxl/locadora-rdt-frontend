import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { SharedModule } from 'src/app/shared/shared.module';
import { ItemDetailsModalComponent } from './components/item-details-modal/item-details-modal.component';
import { ItemsRoutingModule } from './items-routing.module';
import { ItemFormComponent } from './pages/item-form/item-form.component';
import { ItemListComponent } from './pages/item-list/item-list.component';

@NgModule({
  declarations: [ItemListComponent, ItemFormComponent, ItemDetailsModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    InputNumberModule,
    SharedModule,
    ItemsRoutingModule,
  ],
})
export class ItemsModule {}
