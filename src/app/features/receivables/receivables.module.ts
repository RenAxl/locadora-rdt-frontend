import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';

import { ReceivablesRoutingModule } from './receivables-routing.module';
import { ReceivableListComponent } from './pages/receivable-list/receivable-list.component';

@NgModule({
  declarations: [ReceivableListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    SharedModule,
    PaginatorModule,

    ReceivablesRoutingModule,
  ],
})
export class ReceivablesModule {}
