import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('../app/home/home.module').then((m) => m.HomeModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'users',
    loadChildren: () =>
      import('../app/users/users.module').then((m) => m.UsersModule)
  },
  {
    path: 'groups',
    loadChildren: () =>
      import('../app/groups/groups.module').then((m) => m.GroupsModule)
  },
    {
    path: 'access',
    loadChildren: () =>
      import('../app/access/access.module').then((m) => m.AccessModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
