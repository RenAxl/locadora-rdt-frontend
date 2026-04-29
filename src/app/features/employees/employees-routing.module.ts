import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { EmployeeFormComponent } from './pages/employee-form/employee-form.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeListComponent,
  },
  {
    path: 'create',
    component: EmployeeFormComponent,
  },
  {
    path: ':employeeId/edit',
    component: EmployeeFormComponent,
  },
  {
    path: 'positions',
    loadChildren: () =>
      import('./positions/positions.module').then((m) => m.PositionsModule),
  },
  {
    path: 'departments',
    loadChildren: () =>
      import('./departments/departments.module').then((m) => m.DepartmentsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
