import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentListComponent } from './pages/department-list/department-list.component';
import { DepartmentFormComponent } from './pages/department-form/department-form.component';


const routes: Routes = [
  {
    path: '',
    component: DepartmentListComponent,
  },

  {
    path: 'create',
    component: DepartmentFormComponent,
  },

  {
    path: ':departmentId/edit',
    component: DepartmentFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentsRoutingModule {}
