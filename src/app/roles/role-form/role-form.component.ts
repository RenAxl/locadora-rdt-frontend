import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('roleId');

    if (id != null) {
      this.roleService.findById(id).subscribe((data) => {
        this.role = data;
      });
    }
  }

  save(form: NgForm) {
    if (this.role.id != null && this.role.id.toString().trim() != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert() {
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
      error: (error) => this.errorHandler.handle(error),
    });
  }

  update() {
    if (this.role.authority) {
      this.role.authority = this.formatRole(this.role.authority);
    }

    this.roleService.update(this.role).subscribe({
      next: () => {
        this.router.navigate(['/roles']);
        this.messageService.add({
          severity: 'success',
          detail: 'Perfil alterado com sucesso!',
        });
      },
      error: (error) => this.errorHandler.handle(error),
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
