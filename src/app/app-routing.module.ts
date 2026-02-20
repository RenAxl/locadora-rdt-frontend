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
        data: { authorities: ['ROLE_READ', 'ROLE_WRITE'] }, // ANY: entra quem pode ler OU escrever
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
          import('./features/profile/profile.module').then((m) => m.ProfileModule),
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