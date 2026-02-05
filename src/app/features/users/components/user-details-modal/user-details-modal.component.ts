import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/core/models/User';

@Component({
  selector: 'app-user-details-modal',
  templateUrl: './user-details-modal.component.html',
  styleUrls: ['./user-details-modal.component.css']
})
export class UserDetailsModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento do Usuário';
  @Input() user: User | null = null;

  close(): void {
    this.visibleChange.emit(false);
  }

  getActiveLabel(active?: boolean): string {
    if (active === undefined || active === null) return '-';
    return active ? 'Sim' : 'Não';
  }

  getPhotoUrl(photo?: string): string {
    const DEFAULT_PHOTO = 'assets/images/sem-foto.jpg';

    return DEFAULT_PHOTO;
  }

}