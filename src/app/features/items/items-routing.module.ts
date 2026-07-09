import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemFormComponent } from './pages/item-form/item-form.component';
import { ItemListComponent } from './pages/item-list/item-list.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemsRoutingModule {}
