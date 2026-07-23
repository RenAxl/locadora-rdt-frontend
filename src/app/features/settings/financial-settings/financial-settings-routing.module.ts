import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FinancialSettingFormComponent } from './pages/financial-setting-form/financial-setting-form.component';

const routes: Routes = [
  {
    path: '',
    component: FinancialSettingFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialSettingsRoutingModule {}
