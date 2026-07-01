import { Component, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Table } from 'primeng/table';
import { Pagination } from 'src/app/core/models/Pagination';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { catchError, EMPTY } from 'rxjs';
import { UserDTO } from '../../dtos/user.dto';
import { UserMapper } from '../../mapper/user.mapper';
import { UserDetailsDTO } from '../../dtos/user-details.dto';
import {
  addSelectedId,
  removeSelectedId,
} from 'src/app/core/utils/selection.util';
import { PhotoUrlRegistry } from 'src/app/core/utils/photo-preview.util';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnDestroy {
  users: User[] = [];

  pagination: Pagination = new Pagination();

  totalElements: number = 0;

  filterName: string = '';

  selectedUsers: User[] = [];

  selectedUserIds: number[] = [];

  @ViewChild('userTable') grid!: Table;

  detailsVisible = false;

  userDetails: User | null = null;

  photoMap: { [key: number]: SafeUrl } = {};
  private photoUrls: PhotoUrlRegistry;

  constructor(
    private userService: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    sanitizer: DomSanitizer,
  ) {
    this.photoUrls = new PhotoUrlRegistry(sanitizer);
  }
  ngOnDestroy(): void {
    this.photoUrls.clear();
  }

  list(page: number = 0): void {
    this.pagination.page = page;

    this.userService
      .list(this.pagination, this.filterName)
      .subscribe((data) => {
        this.users = data.content.map((dto: UserDTO) =>
          UserMapper.toModel(dto),
        );
        this.totalElements = data.totalElements;

        this.selectedUsers = this.users.filter(
          (u) => u.id != null && this.selectedUserIds.includes(u.id),
        );

        this.loadPhotos();
      });
  }

  changePage(event: LazyLoadEvent): void {
    const page = event!.first! / event!.rows!;
    this.list(page);
  }

  searchUser(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(user: User): void {
    if (!user.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.userService.delete(user.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Usuário excluído com sucesso!',
          });
        });
      },
    });
  }

  onRowSelect(event: any): void {
    this.selectedUserIds = addSelectedId(this.selectedUserIds, event?.data);
  }

  onRowUnselect(event: any): void {
    this.selectedUserIds = removeSelectedId(this.selectedUserIds, event?.data);
  }

  deleteSelectedUsers(): void {
    if (!this.selectedUserIds || this.selectedUserIds.length === 0) return;

    const ids = [...this.selectedUserIds];

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${ids.length} usuário(s)?`,
      accept: () => {
        this.userService.deleteAll(ids).subscribe(() => {
          this.selectedUserIds = [];
          this.selectedUsers = [];

          this.grid.reset();

          this.messageService.add({
            severity: 'success',
            detail: 'Usuários excluídos com sucesso!',
          });
        });
      },
    });
  }

  openDetails(user: User): void {
    const id = user?.id;
    if (id == null) return;

    this.detailsVisible = true;
    this.userDetails = null;

    this.userService.findById(id).subscribe({
      next: (details: UserDetailsDTO) => {
        this.userDetails = UserMapper.toDetailsModel(details);
      },
    });
  }

  toggleActive(user: User): void {
    if (!user?.id) return;

    const newStatus = !user.active;

    this.userService.changeActive(user.id, newStatus).subscribe({
      next: () => {
        user.active = newStatus;

        this.messageService.add({
          severity: 'success',
          detail: `Usuário ${newStatus ? 'ativado' : 'desativado'} com sucesso!`,
        });
      },
    });
  }

  hasAuthority(role: string): boolean {
    return this.authService.hasAuthority(role);
  }

  private loadPhotos(): void {
    this.photoUrls.clear();
    this.photoMap = {};

    this.users.forEach((user) => {
      if (!user?.id) return;

      this.userService
        .getUserPhoto(user.id)
        .pipe(
          catchError(() => {
            // 404 = sem foto (não é erro)
            return EMPTY;
          }),
        )
        .subscribe((blob: Blob) => {
          const photoUrl = this.photoUrls.create(blob);

          if (photoUrl) {
            this.photoMap[user.id!] = photoUrl;
          }
        });
    });
  }
}
