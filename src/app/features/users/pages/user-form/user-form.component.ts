import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/error/services/error-handler.service';
import { Pagination } from 'src/app/core/models/Pagination';
import { UsersService } from '../../services/users.service';
import { User } from '../../../../core/models/User';
import { Role } from 'src/app/core/models/Role';
import { RolesService } from 'src/app/features/roles/services/roles.service';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  user: User = {};

  roles: Role[] = [];

  roleSelectedIds: number[] = [];

  constructor(
    private userService: UsersService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private rolesService: RolesService,
  ) {}

  ngOnInit(): void {
    this.loadRoles();

    const id = this.route.snapshot.paramMap.get('userId');
    if (id != null) {
      this.userService.findById(id).subscribe({
        next: (data) => {
          this.user = data;
          this.roleSelectedIds = (this.user.roles || [])
            .map((r: any) => r?.id)
            .filter((id: any) => typeof id === 'number');

          console.log(
            'Usuário carregado:',
            JSON.parse(JSON.stringify(this.user)),
          );
          console.log('Roles selecionadas (IDs):', this.roleSelectedIds);
        },
      });
    }
  }

  private loadRoles(): void {
    const pagination = new Pagination(0, 1000, 'ASC', 'authority');

    this.rolesService.list(pagination, '').subscribe({
      next: (page: any) => {
        const rolesArray = Array.isArray(page?.content) ? page.content : [];

        this.roles = rolesArray.map((r: any) => ({
          id: r.id,
          authority: r.authority,
          label: r.authority,
        }));
      },
    });
  }

  private applySelectedRolesToUser(): void {
    const uniqueIds = Array.from(new Set(this.roleSelectedIds)).filter(
      (id) => typeof id === 'number',
    );

    this.user.roles = uniqueIds.map((id) => ({ id }) as any);
  }

  save(form: NgForm) {
    this.applySelectedRolesToUser();

    if (this.user.id != null && this.user.id.toString().trim() !== '') {
      this.update();
    } else {
      this.insert();
    }
  }

  insert() {
    console.log('Insert payload:', JSON.parse(JSON.stringify(this.user)));

    this.userService.insert(this.user).subscribe({
      next: () => {
        this.router.navigate(['/users/']);
        this.messageService.add({
          severity: 'success',
          detail:
            'Usuário cadastrado com sucesso!. Para ativar a conta acesse o E-mail cadastrado',
        });
      },
    });
  }

  update() {
    console.log('Update payload:', JSON.parse(JSON.stringify(this.user)));

    this.userService.update(this.user).subscribe({
      next: () => {
        this.router.navigate(['/users/']);
        this.messageService.add({
          severity: 'success',
          detail: 'Usuário atualizado com sucesso!',
        });
      },
    });
  }
}

