import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositionListComponent } from './pages/position-list/position-list.component';
import { PositionFormComponent } from './pages/position-form/position-form.component';

const routes: Routes = [
  {
    path: '',
    component: PositionListComponent,
  },

  {
    path: 'create',
    component: PositionFormComponent,
  },

  {
    path: ':positionId/edit',
    component: PositionFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PositionsRoutingModule {}
