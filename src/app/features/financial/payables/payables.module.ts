import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';

import { PayablesRoutingModule } from './payables-routing.module';
import { PayableListComponent } from './pages/payable-list/payable-list.component';
import { PayableFormComponent } from './pages/payable-form/payable-form.component';
import { PayableDetailsModalComponent } from './components/payable-details-modal/payable-details-modal.component';
import { PayableFilesModalComponent } from './components/payable-files-modal/payable-files-modal.component';
import { PayableFiltersComponent } from './components/payable-filters/payable-filters.component';
import { PayableQuickPeriodFilterComponent } from './components/payable-quick-period-filter/payable-quick-period-filter.component';
import { PayableCardComponent } from './components/payable-card/payable-card.component';
import { PayableOverdueModalComponent } from './components/payable-overdue-modal/payable-overdue-modal.component';
import { PayablePaymentChargesModalComponent } from './components/payable-payment-charges-modal/payable-payment-charges-modal.component';
import { PayablePaymentChoiceModalComponent } from './components/payable-payment-choice-modal/payable-payment-choice-modal.component';
import { PayablePaymentModalComponent } from './components/payable-payment-modal/payable-payment-modal.component';

@NgModule({
  declarations: [
    PayableListComponent,
    PayableFormComponent,
    PayableDetailsModalComponent,
    PayableFilesModalComponent,
    PayableOverdueModalComponent,
    PayablePaymentChoiceModalComponent,
    PayablePaymentChargesModalComponent,
    PayablePaymentModalComponent,
    PayableCardComponent,
    PayableFiltersComponent,
    PayableQuickPeriodFilterComponent,
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

    PayablesRoutingModule,
  ],
})
export class PayablesModule {}
