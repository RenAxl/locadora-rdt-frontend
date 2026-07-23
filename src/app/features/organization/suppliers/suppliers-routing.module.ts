import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierListComponent } from './pages/supplier-list/supplier-list.component';
import { SupplierFormComponent } from './pages/supplier-form/supplier-form.component';

const routes: Routes = [
  { path: '', component: SupplierListComponent },
  { path: 'create', component: SupplierFormComponent },
  { path: ':supplierId/edit', component: SupplierFormComponent },
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class SuppliersRoutingModule {}
