import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { User } from 'src/app/core/models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user: User = new User();

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {}

  save(): void {
    this.authService.login(this.user).subscribe({
      next: (data) => {
        console.log('Token retornado:', data.access_token);
        
        this.messageService.add({
          severity: 'success',
          detail: 'Usuário autenticado com sucesso!',
        });
        this.router.navigate(['/home']);
      },
    });
  }
}
