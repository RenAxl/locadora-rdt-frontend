import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Position } from '../../models/Position';
import { PositionService } from '../../services/position.service';
import { PositionMapper } from '../../mapper/position.mapper';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';

const POSITIONS_ROUTE = '/positions';

@Component({
  selector: 'app-position-form',
  templateUrl: './position-form.component.html',
  styleUrls: ['./position-form.component.css'],
})
export class PositionFormComponent implements OnInit {
  position: Position = new Position();

  constructor(
    private positionService: PositionService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadPositionForEdition();
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.position.id ? this.update() : this.insert();
  }

  private loadPositionForEdition(): void {
    const positionId = this.route.snapshot.paramMap.get('positionId');

    if (!positionId) {
      return;
    }

    this.positionService.findById(positionId).subscribe({
      next: (dto) => {
        this.position = PositionMapper.fromDetailsDTO(dto);
      },
      error: (err) => this.showError(err, 'Erro ao carregar cargo.'),
    });
  }

  private insert(): void {
    const dto = PositionMapper.toInsertDTO(this.position);

    this.positionService.insert(dto).subscribe({
      next: () => {
        this.finishSuccess('Cargo cadastrado com sucesso!');
      },
      error: (err) => this.showError(err, 'Erro ao cadastrar cargo.'),
    });
  }

  private update(): void {
    if (!this.position.id) return;

    const dto = PositionMapper.toUpdateDTO(this.position);

    this.positionService.update(this.position.id, dto).subscribe({
      next: () => {
        this.finishSuccess('Cargo atualizado com sucesso!');
      },
      error: (err) => this.showError(err, 'Erro ao atualizar cargo.'),
    });
  }

  private finishSuccess(detail: string): void {
    this.messageService.add({
      severity: 'success',
      detail,
    });

    this.router.navigate([POSITIONS_ROUTE]);
  }

  private showError(err: { error?: { message?: string } }, fallback: string): void {
    this.messageService.add({
      severity: 'error',
      detail: err?.error?.message || fallback,
    });
  }
}
