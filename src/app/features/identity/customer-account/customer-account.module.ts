import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerAccountRoutingModule } from './customer-account-routing.module';
import { CustomerAccountRegisterComponent } from './pages/register/customer-account-register.component';
import { CustomerAccountCreatePasswordComponent } from './pages/create-password/customer-account-create-password.component';
import { CustomerAccountResendComponent } from './pages/resend/customer-account-resend.component';

@NgModule({
  declarations: [
    CustomerAccountRegisterComponent,
    CustomerAccountCreatePasswordComponent,
    CustomerAccountResendComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    SharedModule,
    CustomerAccountRoutingModule,
  ],
})
export class CustomerAccountModule {}
