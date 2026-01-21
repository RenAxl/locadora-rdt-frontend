import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { RolesRoutingModule } from './roles-routing.module';
import { RoleListComponent } from './role-list/role-list.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [RoleListComponent],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    SharedModule,

    RolesRoutingModule,
  ],
})
export class RolesModule {}
