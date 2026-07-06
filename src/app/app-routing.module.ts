import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './shell/auth/auth.component';
import { MainComponent } from './shell/main/main.component';
import { NotAuthorizedComponent } from './core/pages/not-authorized/not-authorized.component';
import { PageNotFoundComponent } from './core/pages/page-not-found/page-not-found.component';
import { AuthGuard } from './core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./features/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'home',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/home/home.module').then((m) => m.HomeModule),
      },
    ],
  },

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'users',
        canActivate: [AuthGuard],
        data: {
          authorities: [
            'USER_READ',
            'USER_WRITE',
            'USER_DELETE',
            'USER_STATUS_CHANGE',
          ],
        },
        loadChildren: () =>
          import('./features/users/users.module').then((m) => m.UsersModule),
      },
    ],
  },

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'roles',
        canActivate: [AuthGuard],
        data: { authorities: ['ROLE_READ', 'ROLE_WRITE'] },
        loadChildren: () =>
          import('./features/roles/roles.module').then((m) => m.RolesModule),
      },
    ],
  },

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'profile',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/profile/profile.module').then(
            (m) => m.ProfileModule,
          ),
      },
    ],
  },

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'positions',
        loadChildren: () =>
          import('./features/positions/positions.module').then(
            (m) => m.PositionsModule,
          ),
      },
    ],
  },

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'departments',
        loadChildren: () =>
          import('./features/departments/departments.module').then(
            (m) => m.DepartmentsModule,
          ),
      },
    ],
  },

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'customers',
        canActivate: [AuthGuard],
        data: {
          authorities: [
            'CUSTOMER_READ',
            'CUSTOMER_WRITE',
            'CUSTOMER_DELETE',
            'CUSTOMER_STATUS_CHANGE',
          ],
        },
        loadChildren: () =>
          import('./features/customers/customers.module').then(
            (m) => m.CustomersModule,
          ),
      },
    ],
  },

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'employees',
        loadChildren: () =>
          import('./features/employees/employees.module').then(
            (m) => m.EmployeesModule,
          ),
      },
    ],
  },

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'payment-methods',
        loadChildren: () =>
          import('./features/payment-methods/payment-methods.module').then(
            (m) => m.PaymentMethodsModule,
          ),
      },
    ],
  },

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'payment-frequencies',
        loadChildren: () =>
          import('./features/payment-frequencies/payment-frequencies.module').then(
            (m) => m.PaymentFrequenciesModule,
          ),
      },
    ],
  },

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'financial-settings',
        loadChildren: () =>
          import('./features/financial-settings/financial-settings.module').then(
            (m) => m.FinancialSettingsModule,
          ),
      },
    ],
  },

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'receivables',
        loadChildren: () =>
          import('./features/receivables/receivables.module').then(
            (m) => m.ReceivablesModule,
          ),
      },
    ],
  },

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'payables',
        loadChildren: () =>
          import('./features/payables/payables.module').then(
            (m) => m.PayablesModule,
          ),
      },
    ],
  },

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'suppliers',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/suppliers/suppliers.module').then(
            (m) => m.SuppliersModule,
          ),
      },
    ],
  },

  {
    path: 'not-authorized',
    component: NotAuthorizedComponent,
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent,
  },

  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
