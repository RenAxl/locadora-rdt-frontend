import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  hasAuthority(role: string) {
    return this.authService.hasAuthority(role);
  }
  
}
