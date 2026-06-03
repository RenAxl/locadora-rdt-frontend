import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { Pagination } from 'src/app/core/models/Pagination';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user';
import { RolesService } from 'src/app/features/roles/services/roles.service';
import { Role } from 'src/app/features/roles/models/Role';
import { UserMapper } from '../../mapper/user.mapper';
import { RoleMapper } from 'src/app/features/roles/mapper/role.mapper';
import { getUniqueNumericIds } from 'src/app/core/utils/selection.util';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  user: User = new User();

  roles: Role[] = [];

  roleSelectedIds: number[] = [];

  constructor(
    private userService: UsersService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private rolesService: RolesService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('userId');

    this.loadRoles(() => {
      if (id != null) {
        this.loadUser(id);
      }
    });
  }

  private loadRoles(afterLoad?: () => void): void {
    const pagination = new Pagination(0, 1000, 'ASC', 'authority');

    this.rolesService.list(pagination, '').subscribe({
      next: (page) => {
        this.roles = page.content.map((role) => {
          const model = RoleMapper.fromDTO(role);

          return new Role({
            ...model,
            label: model.authority,
          } as Partial<Role>);
        });

        afterLoad?.();
      },
    });
  }

  private loadUser(id: number | string): void {
    this.userService.findById(id).subscribe({
      next: (data) => {
        this.user = UserMapper.toDetailsModel(data);
        this.roleSelectedIds = this.getRoleIdsByAuthority(this.user.roles);
      },
    });
  }

  private applySelectedRolesToUser(): void {
    const uniqueIds = getUniqueNumericIds(this.roleSelectedIds);

    this.user.roles = uniqueIds.map((id) => new Role({ id }));
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.applySelectedRolesToUser();

    if (this.user.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const dto = UserMapper.toInsertDTO(this.user);

    this.userService.insert(dto).subscribe({
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

  update(): void {
    const dto = UserMapper.toUpdateDTO(this.user);

    this.userService.update(dto).subscribe({
      next: () => {
        this.router.navigate(['/users/']);
        this.messageService.add({
          severity: 'success',
          detail: 'Usuário atualizado com sucesso!',
        });
      },
    });
  }

  private getRoleIdsByAuthority(userRoles: Role[]): number[] {
    const idsFromDetails = userRoles
      .map((role) => role.id)
      .filter((id): id is number => typeof id === 'number');

    if (idsFromDetails.length > 0) {
      return idsFromDetails;
    }

    const selectedAuthorities = new Set(
      userRoles.map((role) => role.authority).filter(Boolean),
    );

    return this.roles
      .filter(
        (role) => role.id != null && selectedAuthorities.has(role.authority),
      )
      .map((role) => role.id!);
  }
}
