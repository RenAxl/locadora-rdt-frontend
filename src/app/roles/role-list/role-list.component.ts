import { Component, OnInit, ViewChild } from '@angular/core';
import { RolesService } from '../roles.service';

import { Table } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';

import { RoleList } from 'src/app/core/models/RoleList';
import { Pagination } from 'src/app/core/models/Pagination';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css'],
})
export class RoleListComponent implements OnInit {
  roles: RoleList[] = [];
  selectedRoles: RoleList[] = [];
  pagination: Pagination = new Pagination(0, 4, 'ASC', 'authority');
  totalElements: number = 0;
  filterName: string = '';

  @ViewChild('roleTable') grid!: Table;

  constructor(private roleService: RolesService) {}

  ngOnInit(): void {}

  list(page: number = 0): void {
    this.pagination.page = page;

    this.roleService
      .list(this.pagination, this.filterName)
      .subscribe((data) => {
        this.roles = data.content;
        this.totalElements = data.totalElements;
      });
  }

  changePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;
    this.list(page);
  }

  searchRole(name: string) {
    this.filterName = name;
    this.list();
  }
}
