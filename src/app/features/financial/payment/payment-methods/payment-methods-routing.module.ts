import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentMethodFormComponent } from './pages/payment-method-form/payment-method-form.component';
import { PaymentMethodListComponent } from './pages/payment-method-list/payment-method-list.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentMethodListComponent,
  },
  {
    path: 'create',
    component: PaymentMethodFormComponent,
  },
  {
    path: ':paymentMethodId/edit',
    component: PaymentMethodFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentMethodsRoutingModule {}
