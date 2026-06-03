import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

import { PositionsRoutingModule } from './positions-routing.module';
import { PositionListComponent } from './pages/position-list/position-list.component';
import { PositionFormComponent } from './pages/position-form/position-form.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    PositionListComponent,
    PositionFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    SharedModule,
    DialogModule,

    PositionsRoutingModule,
  ],
})
export class PositionsModule {}
