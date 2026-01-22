import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { Role } from 'src/app/core/models/Role';
import { RolesService } from '../roles.service';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.css'],
})
export class RoleFormComponent implements OnInit {
  role: Role = new Role();

  constructor(
    private roleService: RolesService,
    private messageService: MessageService,
    private router: Router,
    private errorHandler: ErrorHandlerService,
  ) {}

  ngOnInit(): void {}

  save(form: NgForm): void {
    if (this.role.authority) {
      this.role.authority = this.formatRole(this.role.authority);
    }

    this.roleService.insert(this.role).subscribe({
      next: () => {
        this.router.navigate(['/roles']);
        this.messageService.add({
          severity: 'success',
          detail: 'Perfil cadastrado com sucesso!',
        });
      },
    });
  }

  formatRole(value: string): string {
    let role = value
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_') 
      .replace(/[^A-Z0-9_]/g, ''); 

    if (!role.startsWith('ROLE_')) {
      role = 'ROLE_' + role;
    }

    return role;
  }
}
