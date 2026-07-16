import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SystemSettingFormComponent } from './pages/system-setting-form/system-setting-form.component';
import { SystemSettingsRoutingModule } from './system-settings-routing.module';

@NgModule({
  declarations: [SystemSettingFormComponent],
  imports: [CommonModule, FormsModule, SystemSettingsRoutingModule],
})
export class SystemSettingsModule {}
