import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerAccountRegisterComponent } from './pages/register/customer-account-register.component';
import { CustomerAccountCreatePasswordComponent } from './pages/create-password/customer-account-create-password.component';
import { CustomerAccountResendComponent } from './pages/resend/customer-account-resend.component';

const routes: Routes = [
  { path: 'register', component: CustomerAccountRegisterComponent },
  { path: 'create-password', component: CustomerAccountCreatePasswordComponent },
  { path: 'resend', component: CustomerAccountResendComponent },
  { path: '', redirectTo: 'register', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerAccountRoutingModule {}
