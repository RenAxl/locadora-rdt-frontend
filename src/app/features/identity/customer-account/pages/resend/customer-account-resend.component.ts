import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomerAccountService } from '../../services/customer-account.service';

@Component({
  selector: 'app-customer-account-resend',
  templateUrl: './customer-account-resend.component.html',
  styleUrls: ['../customer-account-pages.css'],
})
export class CustomerAccountResendComponent {
  email = '';
  loading = false;

  constructor(
    route: ActivatedRoute,
    private service: CustomerAccountService,
    private messageService: MessageService,
  ) {
    this.email = route.snapshot.queryParamMap.get('email') || '';
  }

  resend(form: NgForm): void {
    if (form.invalid) return;
    this.loading = true;
    this.service.resendActivation(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({ severity: 'success', detail: 'Um novo link de ativação foi enviado.' });
      },
      error: () => this.loading = false,
    });
  }
}
