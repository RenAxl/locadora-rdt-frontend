import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { RolesService } from '../../services/roles.service';
import { Role } from '../../models/Role';
import { RoleMapper } from '../../mapper/role.mapper';
import { normalizeRoleAuthority } from '../../utils/role-authority.util';

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
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('roleId');

    if (id != null) {
      this.roleService.findById(id).subscribe((data) => {
        this.role = RoleMapper.fromDetailsDTO(data);
      });
    }
  }

  save(): void {
    this.role.authority = normalizeRoleAuthority(this.role.authority);

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
}
