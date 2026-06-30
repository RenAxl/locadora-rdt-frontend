import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceivableListComponent } from './pages/receivable-list/receivable-list.component';

const routes: Routes = [
  {
    path: '',
    component: ReceivableListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceivablesRoutingModule {}
