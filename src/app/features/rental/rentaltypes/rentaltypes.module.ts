import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { SharedModule } from 'src/app/shared/shared.module';
import { RentalTypeDetailsModalComponent } from './components/rental-type-details-modal/rental-type-details-modal.component';
import { RentalTypeFormComponent } from './pages/rental-type-form/rental-type-form.component';
import { RentalTypeListComponent } from './pages/rental-type-list/rental-type-list.component';
import { RentalTypesRoutingModule } from './rentaltypes-routing.module';

@NgModule({
  declarations: [
    RentalTypeListComponent,
    RentalTypeFormComponent,
    RentalTypeDetailsModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    SharedModule,
    RentalTypesRoutingModule,
  ],
})
export class RentalTypesModule {}
