import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

import { PaymentMethodMapper } from '../../mapper/payment-method.mapper';
import { PaymentMethod } from '../../models/PaymentMethod';
import { PaymentMethodService } from '../../services/payment-method.service';

@Component({
  selector: 'app-payment-method-form',
  templateUrl: './payment-method-form.component.html',
  styleUrls: ['./payment-method-form.component.css'],
})
export class PaymentMethodFormComponent implements OnInit, OnDestroy {
  paymentMethod: PaymentMethod = new PaymentMethod();

  private subs: Subscription[] = [];

  constructor(
    private service: PaymentMethodService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('paymentMethodId');

    if (id != null) {
      const sub = this.service.findById(id).subscribe({
        next: (data) => {
          this.paymentMethod = PaymentMethodMapper.fromDetailsDTO(data);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail:
              err?.error?.message ||
              'Erro ao carregar forma de pagamento.',
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

    if (this.paymentMethod.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const dto = PaymentMethodMapper.toInsertDTO(this.paymentMethod);

    const sub = this.service.insert(dto).subscribe({
      next: () => {
        this.finishSuccess('Forma de pagamento cadastrada com sucesso!');
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail:
            err?.error?.message ||
            'Erro ao cadastrar forma de pagamento.',
        });
      },
    });

    this.subs.push(sub);
  }

  update(): void {
    if (!this.paymentMethod.id) {
      return;
    }

    const dto = PaymentMethodMapper.toUpdateDTO(this.paymentMethod);

    const sub = this.service.update(dto).subscribe({
      next: () => {
        this.finishSuccess('Forma de pagamento atualizada com sucesso!');
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail:
            err?.error?.message ||
            'Erro ao atualizar forma de pagamento.',
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

    this.paymentMethod = new PaymentMethod();
    this.router.navigate(['/payment-methods']);
  }
}
