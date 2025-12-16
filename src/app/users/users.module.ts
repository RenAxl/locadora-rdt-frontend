import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';



@NgModule({
  declarations: [
    UserListComponent
  ],
  imports: [
    CommonModule,
    TableModule,
     ButtonModule,
     TooltipModule,

    UsersRoutingModule
  ]
})
export class UsersModule { }
