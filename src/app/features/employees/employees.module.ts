import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { EmployeeFormComponent } from './pages/employee-form/employee-form.component';

@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeFormComponent,
  ],
  imports: [
    CommonModule,

    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    SharedModule,
    DialogModule,

    EmployeesRoutingModule,
  ],
})
export class EmployeesModule {}
