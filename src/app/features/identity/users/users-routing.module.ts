import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: [
        'USER_READ',
        'USER_WRITE',
        'USER_DELETE',
        'USER_STATUS_CHANGE',
      ],
    },
  },

  {
    path: 'create',
    component: UserFormComponent,
    canActivate: [AuthGuard],
    data: { authorities: ['USER_WRITE'] },
  },

  {
    path: ':userId/edit',
    component: UserFormComponent,
    canActivate: [AuthGuard],
    data: { authorities: ['USER_WRITE'] },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}