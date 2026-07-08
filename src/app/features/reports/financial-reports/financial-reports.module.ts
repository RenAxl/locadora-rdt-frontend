import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'src/app/shared/shared.module';

import { ReportListComponent } from './pages/report-list/report-list.component';
import { FinancialReportsRoutingModule } from './financial-reports-routing.module';

@NgModule({
  declarations: [ReportListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    SharedModule,
    FinancialReportsRoutingModule,
  ],
})
export class FinancialReportsModule {}
