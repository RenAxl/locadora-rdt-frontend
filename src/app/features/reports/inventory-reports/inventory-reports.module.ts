import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'src/app/shared/shared.module';

import { InventoryReportsRoutingModule } from './inventory-reports-routing.module';
import { InventoryReportListComponent } from './pages/report-list/inventory-report-list.component';

@NgModule({
  declarations: [InventoryReportListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    SharedModule,
    InventoryReportsRoutingModule,
  ],
})
export class InventoryReportsModule {}
