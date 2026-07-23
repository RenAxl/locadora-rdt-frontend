import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

import { PaymentFrequencyMapper } from '../../mapper/payment-frequency.mapper';
import { PaymentFrequency } from '../../models/PaymentFrequency';
import { PaymentFrequencyService } from '../../services/payment-frequency.service';

@Component({
  selector: 'app-payment-frequency-form',
  templateUrl: './payment-frequency-form.component.html',
  styleUrls: ['./payment-frequency-form.component.css'],
})
export class PaymentFrequencyFormComponent implements OnInit, OnDestroy {
  paymentFrequency: PaymentFrequency = new PaymentFrequency();

  private subs: Subscription[] = [];

  constructor(
    private service: PaymentFrequencyService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('paymentFrequencyId');

    if (id != null) {
      const sub = this.service.findById(id).subscribe({
        next: (data) => {
          this.paymentFrequency = PaymentFrequencyMapper.fromDetailsDTO(data);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail:
              err?.error?.message ||
              'Erro ao carregar frequência de pagamento.',
          });
        },
      });

      this.subs.push(sub);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.paymentFrequency.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const dto = PaymentFrequencyMapper.toInsertDTO(this.paymentFrequency);

    const sub = this.service.insert(dto).subscribe({
      next: () => {
        this.finishSuccess('Frequência de pagamento cadastrada com sucesso!');
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail:
            err?.error?.message ||
            'Erro ao cadastrar frequência de pagamento.',
        });
      },
    });

    this.subs.push(sub);
  }

  update(): void {
    if (!this.paymentFrequency.id) {
      return;
    }

    const dto = PaymentFrequencyMapper.toUpdateDTO(this.paymentFrequency);

    const sub = this.service.update(dto).subscribe({
      next: () => {
        this.finishSuccess('Frequência de pagamento atualizada com sucesso!');
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail:
            err?.error?.message ||
            'Erro ao atualizar frequência de pagamento.',
        });
      },
    });

    this.subs.push(sub);
  }

  private finishSuccess(detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail,
    });

    this.paymentFrequency = new PaymentFrequency();
    this.router.navigate(['/payment-frequencies']);
  }
}
