import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentFrequencyFormComponent } from './pages/payment-frequency-form/payment-frequency-form.component';
import { PaymentFrequencyListComponent } from './pages/payment-frequency-list/payment-frequency-list.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentFrequencyListComponent,
  },
  {
    path: 'create',
    component: PaymentFrequencyFormComponent,
  },
  {
    path: ':paymentFrequencyId/edit',
    component: PaymentFrequencyFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentFrequenciesRoutingModule {}
