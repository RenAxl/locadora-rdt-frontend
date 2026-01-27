import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { RolesRoutingModule } from './roles-routing.module';
import { RoleListComponent } from './role-list/role-list.component';
import { SharedModule } from '../shared/shared.module';
import { RoleFormComponent } from './role-form/role-form.component';
import { PermissionComponent } from './permissions/permission/permission.component';

@NgModule({
  declarations: [RoleListComponent, RoleFormComponent, PermissionComponent],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    SharedModule,
    DialogModule,
    DropdownModule,
    CheckboxModule,
    InputTextModule,
    ProgressSpinnerModule,

    RolesRoutingModule,
  ],
})
export class RolesModule {}
