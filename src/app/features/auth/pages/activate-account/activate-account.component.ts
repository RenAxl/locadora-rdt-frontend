import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { UsersService } from 'src/app/features/users/services/users.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css'],
})
export class ActivateAccountComponent {
  token = '';

  password = '';
  confirmPassword = '';

  loading = false;
  apiUrl = 'http://localhost:8080';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  activate(form: NgForm): void {
    if (!this.token) return;

    if (form.invalid) return;

    if (this.password !== this.confirmPassword) {
      form.controls['confirmPassword']?.setErrors({ mismatch: true });
      return;
    }

    this.loading = true;

    this.userService.activateAccount(this.token, this.password).subscribe({
      next: () => {
        this.loading = false;

        this.messageService.add({
          severity: 'success',
          detail:
            'Senha cadastrada com sucesso! Você já pode acessar o sistema.',
        });

        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.loading = false;
        this.errorHandler.handle(error);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/auth/login']);
  }
}
