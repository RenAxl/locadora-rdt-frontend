import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Position } from '../../models/Position';
import { PositionService } from '../../services/position.service';
import { PositionMapper } from '../../mapper/position.mapper';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-position-form',
  templateUrl: './position-form.component.html',
  styleUrls: ['./position-form.component.css'],
})
export class PositionFormComponent implements OnInit {
  position: Position = new Position();

  constructor(
    private service: PositionService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('positionId');

    if (id) {
      this.service.findById(id).subscribe((data) => {
        this.position = PositionMapper.fromDetailsDTO(data);
      });
    }
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.position.id) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const dto = PositionMapper.toInsertDTO(this.position);

    this.service.insert(dto).subscribe({
      next: () => {
        this.router.navigate(['/employees/positions']);
        this.messageService.add({
          severity: 'success',
          detail: 'Cargo cadastrado com sucesso!',
        });
      },
    });
  }

  update(): void {
    if (!this.position.id) return;

    const dto = PositionMapper.toUpdateDTO(this.position);

    this.service.update(this.position.id, dto).subscribe({
      next: () => {
        this.router.navigate(['/employees/positions']);
        this.messageService.add({
          severity: 'success',
          detail: 'Cargo atualizado com sucesso!',
        });
      },
    });
  }
}
