import { Component, OnInit } from '@angular/core';
import { Position } from '../../models/Position';
import { PositionService } from '../../services/position.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

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
    const id = this.route.snapshot.paramMap.get('positionId');

    if (id != null) {
      const sub = this.positionService.findById(id).subscribe({
        next: (data) => {
          this.position = data;
        },
      });
    }
  }

  save(form: NgForm) {
    if (this.position.id != null && this.position.id.toString().trim() !== '') {
      this.update();
    } else {
      this.insert();
    }
  }

insert() {
    this.positionService.insert(this.position).subscribe({
      next: () => {
        this.router.navigate(['/employees/positions/']);
        this.messageService.add({
          severity: 'success',
          detail:
            'Cargo cadastrado com sucesso!. Para ativar a conta acesse o E-mail cadastrado',
        });
      },
    });
  }

  update() {
    this.positionService.update(this.position).subscribe({
      next: () => {
        this.router.navigate(['/employees/positions/']);
        this.messageService.add({
          severity: 'success',
          detail: 'Cargo atualizado com sucesso!',
        });
      },
    });
  }

}
