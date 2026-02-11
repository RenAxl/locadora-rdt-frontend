import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileFormComponent } from './pages/profile-form/profile-form.component';
import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ProfileFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,         
    SharedModule,        
    InputTextModule,     
    ProfileRoutingModule
  ],
})
export class ProfileModule {}
