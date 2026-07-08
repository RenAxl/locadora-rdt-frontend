import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

import { RentalTypeMapper } from '../../mapper/rental-type.mapper';
import { RentalType } from '../../models/RentalType';
import { RentalTypeService } from '../../services/rental-type.service';

@Component({
  selector: 'app-rental-type-form',
  templateUrl: './rental-type-form.component.html',
  styleUrls: ['./rental-type-form.component.css'],
})
export class RentalTypeFormComponent implements OnInit, OnDestroy {
  rentalType: RentalType = new RentalType();

  private subs: Subscription[] = [];

  constructor(
    private rentalTypeService: RentalTypeService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('rentalTypeId');

    if (id != null) {
      const sub = this.rentalTypeService.findById(id).subscribe({
        next: (data) => {
          this.rentalType = RentalTypeMapper.fromDetailsDTO(data);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail:
              err?.error?.message || 'Erro ao carregar tipo de locação.',
          });
        },
      });

      this.subs.push(sub);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.rentalType.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const dto = RentalTypeMapper.toInsertDTO(this.rentalType);

    const sub = this.rentalTypeService.insert(dto).subscribe({
      next: () => {
        this.finishSuccess('Tipo de locação cadastrado com sucesso!');
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail:
            err?.error?.message || 'Erro ao cadastrar tipo de locação.',
        });
      },
    });

    this.subs.push(sub);
  }

  update(): void {
    if (!this.rentalType.id) {
      return;
    }

    const dto = RentalTypeMapper.toUpdateDTO(this.rentalType);

    const sub = this.rentalTypeService.update(dto).subscribe({
      next: () => {
        this.finishSuccess('Tipo de locação atualizado com sucesso!');
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail:
            err?.error?.message || 'Erro ao atualizar tipo de locação.',
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

    this.rentalType = new RentalType();

    this.router.navigate(['/rental/rentaltypes']);
  }
}
