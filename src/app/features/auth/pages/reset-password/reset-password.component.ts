import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';

  password: string = '';
  confirmPassword: string = '';

  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.token = (this.route.snapshot.queryParamMap.get('token') ?? '').trim();
  }

  reset(form: NgForm): void {
    if (!this.token) {
      this.messageService.add({
        severity: 'warn',
        detail: 'Token não encontrado na URL. Abra novamente o link do e-mail.',
      });
      return;
    }

    if (form.invalid) return;

    if (this.password !== this.confirmPassword) {
      form.controls['confirmPassword']?.setErrors({ mismatch: true });
      return;
    }

    this.loading = true;

    this.authService.resetPassword(this.token, this.password).subscribe({
      next: () => {
        this.loading = false;

        this.messageService.add({
          severity: 'success',
          detail: 'Senha redefinida com sucesso! Faça login com a nova senha.',
        });

        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;

        const msg =
          err?.error?.message ||
          err?.error?.error ||
          err?.message ||
          'Não foi possível redefinir a senha.';

        this.messageService.add({
          severity: 'error',
          detail: msg,
        });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/auth/login']);
  }
}