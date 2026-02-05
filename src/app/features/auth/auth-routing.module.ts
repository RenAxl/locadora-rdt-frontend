import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivateAccountComponent } from '../../features/auth/pages/activate-account/activate-account.component';
import { LoginComponent } from '../../features/auth/pages/login/login.component';

const routes: Routes = [
  { 
    path: 'activate', 
    component: ActivateAccountComponent 
  },
    { 
    path: 'login', 
    component: LoginComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
