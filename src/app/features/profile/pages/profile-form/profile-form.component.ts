import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Profile } from '../../models/Profile';


@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css'],
})
export class ProfileFormComponent implements OnInit {
  userId!: number;
  profile: Profile = new Profile();
  selectedPhoto?: File;
  selectedPhotoName?: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('User ID (rota):', this.userId);
  }

  onPhotoSelected(event: any): void {
    const file: File | undefined = event?.target?.files?.[0];
    this.selectedPhoto = file;
    this.selectedPhotoName = file?.name;
  }

}
