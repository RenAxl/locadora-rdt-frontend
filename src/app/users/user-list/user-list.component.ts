import { Component, OnInit, ViewChild } from '@angular/core';

import { UsersService } from '../users.service';
import { User } from 'src/app/core/models/User';
import { Table } from 'primeng/table';
import { Pagination } from 'src/app/core/models/Pagination';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  pagination: Pagination = new Pagination();

  totalElements: number = 0;

  filterName: string = '';

  selectedUsers: User[] = [];

  selectedUserIds: number[] = [];

  @ViewChild('userTable') grid!: Table;

  detailsVisible = false;

  userDetails: User | null = null;

  constructor(
    private userService: UsersService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {}

  list(page: number = 0): void {
    this.pagination.page = page;

    this.userService
      .list(this.pagination, this.filterName)
      .subscribe((data) => {
        this.users = data.content;
        this.totalElements = data.totalElements;

        // Reaplica seleção na página atual com base no array global
        this.selectedUsers = this.users.filter(
          (u) => u.id != null && this.selectedUserIds.includes(u.id)
        );
      });
  }

  changePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;
    this.list(page);
  }

  searchUser(name: string) {
    this.filterName = name;
    this.list();
  }

  delete(user: any) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.userService.delete(user.id).subscribe(
          () => {
            this.grid.reset();
            this.messageService.add({
              severity: 'success',
              detail: 'Usuário excluído com sucesso!',
            });
          },
          (error) => this.errorHandler.handle(error)
        );
      },
    });
  }

  onRowSelect(event: any): void {
    const id = event?.data?.id;
    if (id == null) return;

    if (!this.selectedUserIds.includes(id)) {
      this.selectedUserIds.push(id);
    }

    console.log('IDs selecionados:', this.selectedUserIds);
  }

  onRowUnselect(event: any): void {
    const id = event?.data?.id;
    if (id == null) return;

    this.selectedUserIds = this.selectedUserIds.filter((x) => x !== id);

    console.log('IDs selecionados:', this.selectedUserIds);
  }


deleteSelectedUsers(): void {
  if (!this.selectedUserIds || this.selectedUserIds.length === 0) return;

  const ids = [...this.selectedUserIds];

  this.confirmationService.confirm({
    message: `Tem certeza que deseja excluir ${ids.length} usuário(s)?`,
    accept: () => {
      this.userService.deleteAll(ids).subscribe(
        () => {
          this.selectedUserIds = [];
          this.selectedUsers = [];

          this.grid.reset();

          this.messageService.add({
            severity: 'success',
            detail: 'Usuários excluídos com sucesso!',
          });
        },
        (error) => this.errorHandler.handle(error)
      );
    },
  });
}

openDetails(user: User): void {
  const id = user?.id;
  if (id == null) return;

  
  this.detailsVisible = true;
  this.userDetails = null;

  this.userService.findById(id).subscribe({
    next: (details: User) => {
      this.userDetails = details;
    },
    error: (error) => {
      this.detailsVisible = false;
      this.errorHandler.handle(error);
    },
  });
}

}
