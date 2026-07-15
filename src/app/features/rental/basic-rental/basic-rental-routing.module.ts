import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RentalDetailsComponent } from './pages/rental-details/rental-details.component';
import { RentalFormComponent } from './pages/rental-form/rental-form.component';
import { RentalListComponent } from './pages/rental-list/rental-list.component';

const routes: Routes = [
  { path: '', component: RentalListComponent },
  { path: 'create', component: RentalFormComponent },
  { path: ':rentalId/edit', component: RentalFormComponent },
  { path: ':rentalId', component: RentalDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasicRentalRoutingModule {}
