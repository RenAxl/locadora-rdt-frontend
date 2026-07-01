import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceivableListComponent } from './pages/receivable-list/receivable-list.component';
import { ReceivableFormComponent } from './pages/receivable-form/receivable-form.component';

const routes: Routes = [
  {
    path: '',
    component: ReceivableListComponent,
  },
  {
    path: 'create',
    component: ReceivableFormComponent,
  },
  {
    path: ':receivableId/edit',
    component: ReceivableFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceivablesRoutingModule {}
