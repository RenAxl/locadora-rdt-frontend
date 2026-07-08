import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RentalTypeFormComponent } from './pages/rental-type-form/rental-type-form.component';
import { RentalTypeListComponent } from './pages/rental-type-list/rental-type-list.component';

const routes: Routes = [
  {
    path: '',
    component: RentalTypeListComponent,
  },
  {
    path: 'create',
    component: RentalTypeFormComponent,
  },
  {
    path: ':rentalTypeId/edit',
    component: RentalTypeFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RentalTypesRoutingModule {}
