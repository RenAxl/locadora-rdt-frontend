import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

import { DepartmentsRoutingModule } from './departments-routing.module';
import { DepartmentListComponent } from './pages/department-list/department-list.component';
import { DepartmentFormComponent } from './pages/department-form/department-form.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    DepartmentListComponent,
    DepartmentFormComponent
    ],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    SharedModule,
    DialogModule,

    DepartmentsRoutingModule,
  ],
})
export class DepartmentsModule {}
