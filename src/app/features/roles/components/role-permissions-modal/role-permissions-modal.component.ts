import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MessageService } from 'primeng/api';

import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { PermissionsService } from '../../services/permissions.service';
import { Permission } from 'src/app/features/roles/models/Permission';
import { RolePermissionsUpdateDTO } from 'src/app/features/roles/models/RolePermissionsUpdateDTO';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-role-permissions-modal',
  templateUrl: './role-permissions-modal.component.html',
  styleUrls: ['./role-permissions-modal.component.css'],
})
export class PermissionComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() roleId?: number;
  @Input() roleAuthority?: string;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<void>();

  loading: boolean = false;
  saving: boolean = false;

  groups: string[] = [];
  selectedGroup: string = '';

  permissions: Permission[] = [];
  selectedIds = new Set<number>();

  filterText: string = '';

  selectedCountInView: number = 0;
  filteredCount: number = 0;

  constructor(
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true && this.roleId) {
      this.init(this.roleId);
    }
  }

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  private init(roleId: number): void {
    this.loading = true;
    this.saving = false;

    this.groups = [];
    this.selectedGroup = '';
    this.permissions = [];
    this.filterText = '';
    this.selectedIds.clear();

    this.selectedCountInView = 0;
    this.filteredCount = 0;

    this.rolesService.findById(roleId).subscribe({
      next: (role) => {
        const currentPermissions: Permission[] = role?.permissions || [];
        currentPermissions.forEach((p) => {
          if (p?.id != null) this.selectedIds.add(Number(p.id));
        });

        this.permissionsService.listGroups().subscribe({
          next: (groups) => {
            this.groups = (groups || [])
              .slice()
              .sort((a, b) => a.localeCompare(b));

            if (this.groups.length > 0) {
              this.selectedGroup = this.groups[0];
              this.loadPermissionsByGroup(this.selectedGroup);
            } else {
              this.loading = false;
            }
          },
        });
      },
    });
  }

  onGroupChange(): void {
    if (!this.selectedGroup) {
      this.permissions = [];
      this.recalcCounters();
      return;
    }
    this.loadPermissionsByGroup(this.selectedGroup);
  }

  onFilterChange(): void {
    this.recalcCounters();
  }

  private loadPermissionsByGroup(groupName: string): void {
    this.loading = true;

    this.permissionsService.listByGroup(groupName).subscribe({
      next: (list) => {
        this.permissions = list || [];
        this.loading = false;
        this.recalcCounters();
      },
    });
  }

  filteredPermissions(): Permission[] {
    const q = this.filterText.trim().toLowerCase();
    if (!q) return this.permissions;

    return this.permissions.filter((p) =>
      String(p.name || '')
        .toLowerCase()
        .includes(q),
    );
  }

  private recalcCounters(): void {
    const visible = this.filteredPermissions();
    this.filteredCount = visible.length;

    let count = 0;
    visible.forEach((p) => {
      if (p?.id != null && this.selectedIds.has(Number(p.id))) count++;
    });

    this.selectedCountInView = count;
  }

  isChecked(permissionId?: number): boolean {
    if (permissionId == null) return false;
    return this.selectedIds.has(Number(permissionId));
  }

  toggle(permissionId?: number, checked?: boolean): void {
    if (permissionId == null) return;
    const id = Number(permissionId);

    if (checked) this.selectedIds.add(id);
    else this.selectedIds.delete(id);

    this.recalcCounters();
  }

  allCheckedCurrentGroup(): boolean {
    const visible = this.filteredPermissions();
    if (visible.length === 0) return false;

    return visible.every(
      (p) => p.id != null && this.selectedIds.has(Number(p.id)),
    );
  }

  toggleAllCurrentGroup(checked: boolean): void {
    const visible = this.filteredPermissions();

    visible.forEach((p) => {
      if (p.id == null) return;
      const id = Number(p.id);

      if (checked) this.selectedIds.add(id);
      else this.selectedIds.delete(id);
    });

    this.recalcCounters();
  }

  save(): void {
    if (!this.roleId) return;

    const dto = new RolePermissionsUpdateDTO();
    dto.permissionIds = Array.from(this.selectedIds.values());

    this.saving = true;

    this.rolesService.updatePermissions(this.roleId, dto).subscribe({
      next: () => {
        this.saving = false;
        this.messageService.add({
          severity: 'success',
          detail: 'Permissões atualizadas com sucesso!',
        });
        this.saved.emit();
        this.close();
      },
    });
  }
}
