import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemFormComponent } from './pages/item-form/item-form.component';
import { ItemListComponent } from './pages/item-list/item-list.component';
import { StockBalanceListComponent } from './pages/stock-balance-list/stock-balance-list.component';
import { StockMovementFormComponent } from './pages/stock-movement-form/stock-movement-form.component';
import { StockMovementListComponent } from './pages/stock-movement-list/stock-movement-list.component';

const routes: Routes = [
  {
    path: '',
    component: ItemListComponent,
  },
  {
    path: 'create',
    component: ItemFormComponent,
  },
  {
    path: ':itemId/edit',
    component: ItemFormComponent,
  },
  {
    path: 'stock-balances',
    component: StockBalanceListComponent,
  },
  {
    path: 'stock-movements',
    component: StockMovementListComponent,
  },
  {
    path: 'stock-movements/create',
    component: StockMovementFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemsRoutingModule {}
