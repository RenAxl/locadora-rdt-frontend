import { Component, OnInit, ViewChild } from '@angular/core';
import { Role } from 'src/app/core/models/Role';
import { RolesService } from '../roles.service';

import { Table } from 'primeng/table';
import { RoleList } from 'src/app/core/models/RoleList';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css'],
})
export class RoleListComponent implements OnInit {
  roles: RoleList[] = [];
  selectedRoles: RoleList[] = [];

  @ViewChild('roleTable') grid!: Table;

  constructor(private roleService: RolesService) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.roleService.list().subscribe((data) => {
      this.roles = data;
      console.log(data);
    });
  }
}
