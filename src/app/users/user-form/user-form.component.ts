import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/core/models/User';
import { UsersService } from '../users.service';
import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';


type RoleOption = {
  id: number;
  authority: string;
  label: string; 
};

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  user: User = {};

  roles: RoleOption[] = [];

  roleSelectedIds: number[] = [];

  constructor(
    private userService: UsersService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService
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
            JSON.parse(JSON.stringify(this.user))
          );
          console.log('Roles selecionadas (IDs):', this.roleSelectedIds);
        },
        error: (error) => this.errorHandler.handle(error),
      });
    }
  }


  private loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (roles: any[]) => {
        this.roles = (roles || []).map((r) => ({
          id: r.id,
          authority: r.authority,
          label: this.stripRolePrefix(r.authority),
        }));

        console.log(
          'Roles do backend (formatados):',
          JSON.parse(JSON.stringify(this.roles))
        );
      },
      error: (error) => this.errorHandler.handle(error),
    });
  }


  stripRolePrefix(authority?: string): string {
    if (!authority) return '';
    return authority.startsWith('ROLE_')
      ? authority.substring(5)
      : authority;
  }

  private applySelectedRolesToUser(): void {
    const uniqueIds = Array.from(new Set(this.roleSelectedIds)).filter(
      (id) => typeof id === 'number'
    );

    this.user.roles = uniqueIds.map((id) => ({ id } as any));
  }

  save(form: NgForm) {
    console.log('Submit disparado. Form:', form);

    this.applySelectedRolesToUser();

    console.log(
      'Payload final do usuário:',
      JSON.parse(JSON.stringify(this.user))
    );

    if (this.user.id != null && this.user.id.toString().trim() !== '') {
      this.update();
    } else {
      this.insert();
    }
  }

  insert() {
    console.log(
      'Insert payload:',
      JSON.parse(JSON.stringify(this.user))
    );

    this.userService.insert(this.user).subscribe({
      next: () => {
        this.router.navigate(['/users/']);
        this.messageService.add({
          severity: 'success',
          detail: 'Usuário cadastrado com sucesso!',
        });
      },
      error: (error) => this.errorHandler.handle(error),
    });
  }

  update() {
    console.log(
      'Update payload:',
      JSON.parse(JSON.stringify(this.user))
    );

    this.userService.update(this.user).subscribe({
      next: () => {
        this.router.navigate(['/users/']);
        this.messageService.add({
          severity: 'success',
          detail: 'Usuário atualizado com sucesso!',
        });
      },
      error: (error) => this.errorHandler.handle(error),
    });
  }
}
