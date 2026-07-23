import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './pages/customer-list/customer-list.component';
import { CustomerFormComponent } from './pages/customer-form/customer-form.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerListComponent,
    data: {
      authorities: [
        'CUSTOMER_READ',
        'CUSTOMER_WRITE',
        'CUSTOMER_DELETE',
        'CUSTOMER_STATUS_CHANGE',
      ],
    },
  },

  {
    path: 'create',
    component: CustomerFormComponent,
    data: {
      authorities: ['CUSTOMER_WRITE'],
    },
  },
  {
    path: ':customerId/edit',
    component: CustomerFormComponent,
    data: {
      authorities: ['CUSTOMER_WRITE'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule {}
