import { Component, OnInit } from '@angular/core';

type RoleRow = {
  id: number;
  name: string;
  description: string;
  permissionsCount: number;
};

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css'],
})
export class RoleListComponent implements OnInit {
  roles: RoleRow[] = [];
  selectedRoles: RoleRow[] = [];

  constructor() {}

  ngOnInit(): void {
     this.roles = [
      {
        id: 1,
        name: 'ADMINISTRADOR',
        description: 'Acesso total ao sistema',
        permissionsCount: 42,
      },
      {
        id: 2,
        name: 'GERENTE',
        description: 'Gerencia operações e relatórios',
        permissionsCount: 28,
      },
      {
        id: 3,
        name: 'ATENDENTE',
        description: 'Atendimento e cadastro básico',
        permissionsCount: 14,
      },
      {
        id: 4,
        name: 'FINANCEIRO',
        description: 'Cobranças, pagamentos e faturamento',
        permissionsCount: 19,
      },
      {
        id: 5,
        name: 'CLIENTE',
        description: 'Acesso somente às próprias informações',
        permissionsCount: 6,
      },
      {
        id: 6,
        name: 'AUDITORIA',
        description: 'Visualização e trilhas de auditoria',
        permissionsCount: 11,
      },
      {
        id: 7,
        name: 'SUPORTE',
        description: 'Apoio técnico e atendimento interno',
        permissionsCount: 9,
      },
    ];
  }
}
