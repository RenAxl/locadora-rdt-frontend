import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'financial-reports',
    pathMatch: 'full',
  },
  {
    path: 'financial-reports',
    loadChildren: () =>
      import('./financial-reports/financial-reports.module').then(
        (m) => m.FinancialReportsModule,
      ),
  },
  {
    path: 'inventory-reports',
    loadChildren: () =>
      import('./inventory-reports/inventory-reports.module').then(
        (m) => m.InventoryReportsModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
