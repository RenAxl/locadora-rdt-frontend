import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CustomerAccountRegistration } from '../../models/customer-account';
import { CustomerAccountService } from '../../services/customer-account.service';

@Component({
  selector: 'app-customer-account-register',
  templateUrl: './customer-account-register.component.html',
  styleUrls: ['../customer-account-pages.css'],
})
export class CustomerAccountRegisterComponent {
  loading = false;
  registration: CustomerAccountRegistration = {
    name: '', cpf: '', email: '', phone: '', street: '', number: '',
    complement: '', neighborhood: '', city: '', state: '', zipCode: '',
  };

  constructor(
    private service: CustomerAccountService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  register(form: NgForm): void {
    if (form.invalid) return;
    this.loading = true;
    this.service.register(this.registration).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          detail: 'Cadastro realizado! Enviamos um link para você criar sua senha.',
        });
        this.router.navigate(['/customer-account/resend'], {
          queryParams: { email: this.registration.email },
        });
      },
      error: () => this.loading = false,
    });
  }
}
