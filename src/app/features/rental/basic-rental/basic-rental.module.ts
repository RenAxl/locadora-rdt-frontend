import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { BasicRentalRoutingModule } from './basic-rental-routing.module';
import { RentalDetailsComponent } from './pages/rental-details/rental-details.component';
import { RentalFormComponent } from './pages/rental-form/rental-form.component';
import { RentalListComponent } from './pages/rental-list/rental-list.component';

@NgModule({
  declarations: [RentalListComponent, RentalFormComponent, RentalDetailsComponent],
  imports: [CommonModule, FormsModule, ButtonModule, PaginatorModule, TableModule, BasicRentalRoutingModule],
})
export class BasicRentalModule {}
