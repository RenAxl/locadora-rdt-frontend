import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';

import { PaymentMethodDetailsModalComponent } from './components/payment-method-details-modal/payment-method-details-modal.component';
import { PaymentMethodsRoutingModule } from './payment-methods-routing.module';
import { PaymentMethodFormComponent } from './pages/payment-method-form/payment-method-form.component';
import { PaymentMethodListComponent } from './pages/payment-method-list/payment-method-list.component';

@NgModule({
  declarations: [
    PaymentMethodListComponent,
    PaymentMethodFormComponent,
    PaymentMethodDetailsModalComponent,
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

    PaymentMethodsRoutingModule,
  ],
})
export class PaymentMethodsModule {}
