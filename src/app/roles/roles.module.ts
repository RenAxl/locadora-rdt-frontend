import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { RolesRoutingModule } from './roles-routing.module';
import { RoleListComponent } from './role-list/role-list.component';
import { SharedModule } from '../shared/shared.module';
import { RoleFormComponent } from './role-form/role-form.component';



@NgModule({
  declarations: [RoleListComponent, RoleFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    SharedModule,

    RolesRoutingModule,
  ],
})
export class RolesModule {}
