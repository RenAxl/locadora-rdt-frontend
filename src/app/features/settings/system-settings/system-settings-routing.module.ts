import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemSettingFormComponent } from './pages/system-setting-form/system-setting-form.component';

const routes: Routes = [{ path: '', component: SystemSettingFormComponent }];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class SystemSettingsRoutingModule {}
