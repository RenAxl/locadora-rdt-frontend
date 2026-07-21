import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { BasicRentalRoutingModule } from './basic-rental-routing.module';
import { RentalCardComponent } from './components/rental-card/rental-card.component';
import { RentalOverdueModalComponent } from './components/rental-overdue-modal/rental-overdue-modal.component';
import { RentalCheckoutModalComponent } from './components/rental-checkout-modal/rental-checkout-modal.component';
import { RentalDetailsComponent } from './pages/rental-details/rental-details.component';
import { RentalFormComponent } from './pages/rental-form/rental-form.component';
import { RentalListComponent } from './pages/rental-list/rental-list.component';

@NgModule({
  declarations: [RentalListComponent, RentalFormComponent, RentalDetailsComponent, RentalCardComponent, RentalOverdueModalComponent, RentalCheckoutModalComponent],
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule, InputNumberModule, PaginatorModule, TableModule, TooltipModule, BasicRentalRoutingModule],
})
export class BasicRentalModule {}
