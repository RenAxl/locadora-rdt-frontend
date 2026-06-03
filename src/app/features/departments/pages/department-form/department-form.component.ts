import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Department } from '../../models/Department';
import { DepartmentService } from '../../services/department.service';
import { DepartmentMapper } from '../../mapper/department.mapper';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.css'],
})
export class DepartmentFormComponent implements OnInit {
  department: Department = new Department();

  constructor(
    private service: DepartmentService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('departmentId');

    if (id) {
      this.service.findById(id).subscribe((data) => {
        this.department = DepartmentMapper.fromDetailsDTO(data);
      });
    }
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.department.id) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert(): void {
    const dto = DepartmentMapper.toInsertDTO(this.department);

    this.service.insert(dto).subscribe({
      next: () => {
        this.router.navigate(['/departments']);
        this.messageService.add({
          severity: 'success',
          detail: 'Setor cadastrado com sucesso!',
        });
      },
    });
  }

  update(): void {
    if (!this.department.id) return;

    const dto = DepartmentMapper.toUpdateDTO(this.department);

    this.service.update(this.department.id, dto).subscribe({
      next: () => {
        this.router.navigate(['/departments']);
        this.messageService.add({
          severity: 'success',
          detail: 'Setor atualizado com sucesso!',
        });
      },
    });
  }
}
