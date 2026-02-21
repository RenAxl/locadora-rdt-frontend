import { Component, OnInit } from '@angular/core';
import { Profile } from '../../models/Profile';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css'],
})
export class ProfileFormComponent implements OnInit {

  profile: Profile = new Profile();
  selectedPhoto?: File;
  selectedPhotoName?: string;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.profileService.getMe().subscribe({
      next: (data) => {
        // garante que senha/confirm não vêm preenchidas
        this.profile = {
          ...this.profile,
          ...data,
          password: '',
          confirmPassword: '',
        };
      },
      error: (err) => {
        console.error('Erro ao carregar perfil:', err);
      },
    });
  }

  onPhotoSelected(event: any): void {
    const file: File | undefined = event?.target?.files?.[0];
    this.selectedPhoto = file;
    this.selectedPhotoName = file?.name;
  }
  
}
