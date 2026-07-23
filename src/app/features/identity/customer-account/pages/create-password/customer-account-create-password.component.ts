import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomerAccountService } from '../../services/customer-account.service';

@Component({
  selector: 'app-customer-account-create-password',
  templateUrl: './customer-account-create-password.component.html',
  styleUrls: ['../customer-account-pages.css'],
})
export class CustomerAccountCreatePasswordComponent {
  token = '';
  password = '';
  passwordConfirmation = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CustomerAccountService,
    private messageService: MessageService,
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  createPassword(form: NgForm): void {
    if (form.invalid || !this.token) return;
    if (this.password !== this.passwordConfirmation) {
      form.controls['passwordConfirmation']?.setErrors({ mismatch: true });
      return;
    }
    this.loading = true;
    this.service.createPassword(this.token, {
      password: this.password,
      passwordConfirmation: this.passwordConfirmation,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          detail: 'Conta ativada com sucesso! Faça seu login.',
        });
        this.router.navigate(['/auth/login']);
      },
      error: () => this.loading = false,
    });
  }
}
