import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InventoryReportListComponent } from './pages/report-list/inventory-report-list.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryReportListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryReportsRoutingModule {}
