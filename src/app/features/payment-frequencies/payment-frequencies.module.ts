import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';

import { PaymentFrequencyDetailsModalComponent } from './components/payment-frequency-details-modal/payment-frequency-details-modal.component';
import { PaymentFrequenciesRoutingModule } from './payment-frequencies-routing.module';
import { PaymentFrequencyFormComponent } from './pages/payment-frequency-form/payment-frequency-form.component';
import { PaymentFrequencyListComponent } from './pages/payment-frequency-list/payment-frequency-list.component';

@NgModule({
  declarations: [
    PaymentFrequencyListComponent,
    PaymentFrequencyFormComponent,
    PaymentFrequencyDetailsModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    SharedModule,
    DialogModule,
    InputNumberModule,

    PaymentFrequenciesRoutingModule,
  ],
})
export class PaymentFrequenciesModule {}
