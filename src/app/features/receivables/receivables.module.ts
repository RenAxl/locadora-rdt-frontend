import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';

import { ReceivablesRoutingModule } from './receivables-routing.module';
import { ReceivableListComponent } from './pages/receivable-list/receivable-list.component';
import { ReceivableFormComponent } from './pages/receivable-form/receivable-form.component';
import { ReceivableDetailsModalComponent } from './components/receivable-details-modal/receivable-details-modal.component';
import { ReceivableFilesModalComponent } from './components/receivable-files-modal/receivable-files-modal.component';
import { ReceivableFiltersComponent } from './components/receivable-filters/receivable-filters.component';
import { ReceivableQuickPeriodFilterComponent } from './components/receivable-quick-period-filter/receivable-quick-period-filter.component';
import { ReceivableCardComponent } from './components/receivable-card/receivable-card.component';

@NgModule({
  declarations: [
    ReceivableListComponent,
    ReceivableFormComponent,
    ReceivableDetailsModalComponent,
    ReceivableFilesModalComponent,
    ReceivableCardComponent,
    ReceivableFiltersComponent,
    ReceivableQuickPeriodFilterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    InputNumberModule,
    SharedModule,

    ReceivablesRoutingModule,
  ],
})
export class ReceivablesModule {}
