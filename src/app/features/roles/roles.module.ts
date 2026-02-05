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
import { SharedModule } from '../../shared/shared.module';
import { PermissionComponent } from './components/role-permissions-modal/role-permissions-modal.component';
import { RoleListComponent } from './pages/role-list/role-list.component';
import { RoleFormComponent } from './pages/role-form/role-form.component';

@NgModule({
  declarations: [
    RoleListComponent, 
    RoleFormComponent, 
    PermissionComponent
  ],
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
