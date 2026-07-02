import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

import { FinancialSettingMapper } from '../../mapper/financial-setting.mapper';
import { FinancialSetting } from '../../models/FinancialSetting';
import { FinancialSettingService } from '../../services/financial-setting.service';

@Component({
  selector: 'app-financial-setting-form',
  templateUrl: './financial-setting-form.component.html',
  styleUrls: ['./financial-setting-form.component.css'],
})
export class FinancialSettingFormComponent implements OnInit, OnDestroy {
  financialSetting: FinancialSetting = new FinancialSetting();
  loading = false;
  saving = false;

  private subs: Subscription[] = [];

  constructor(
    private service: FinancialSettingService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadFinancialSetting();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  save(form: NgForm): void {
    if (form.invalid || this.hasNegativeValue()) {
      form.control.markAllAsTouched();
      return;
    }

    this.saving = true;

    const dto = FinancialSettingMapper.toUpdateDTO(this.financialSetting);

    const sub = this.service.update(dto).subscribe({
      next: (data) => {
        this.financialSetting = FinancialSettingMapper.fromDTO(data);
        this.saving = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Configurações financeiras atualizadas com sucesso!',
        });
      },
      error: (err) => {
        this.saving = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail:
            err?.error?.message ||
            'Erro ao atualizar configurações financeiras.',
        });
      },
    });

    this.subs.push(sub);
  }

  hasNegativeValue(): boolean {
    return (
      this.isNegative(this.financialSetting.defaultLateFeePercent) ||
      this.isNegative(this.financialSetting.defaultLateInterestPercent)
    );
  }

  private loadFinancialSetting(): void {
    this.loading = true;

    const sub = this.service.findCurrent().subscribe({
      next: (data) => {
        this.financialSetting = FinancialSettingMapper.fromDTO(data);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail:
            err?.error?.message ||
            'Erro ao carregar configurações financeiras.',
        });
      },
    });

    this.subs.push(sub);
  }

  private isNegative(value: number | null | undefined): boolean {
    return value != null && value < 0;
  }
}
