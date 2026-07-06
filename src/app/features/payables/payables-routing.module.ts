import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayableListComponent } from './pages/payable-list/payable-list.component';
import { PayableFormComponent } from './pages/payable-form/payable-form.component';

const routes: Routes = [
  {
    path: '',
    component: PayableListComponent,
  },
  {
    path: 'create',
    component: PayableFormComponent,
  },
  {
    path: ':payableId/edit',
    component: PayableFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayablesRoutingModule {}
