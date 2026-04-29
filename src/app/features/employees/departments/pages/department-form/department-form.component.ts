import { Component, OnInit } from '@angular/core';
import { Department } from '../../models/Department';
import { DepartmentService } from '../../services/department.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.css'],
})
export class DepartmentFormComponent implements OnInit {
  department: Department = new Department();

  constructor(
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('departmentId');

    if (id != null) {
      const sub = this.departmentService.findById(id).subscribe({
        next: (data) => {
          this.department = data;
        },
      });
    }
  }

  save(form: NgForm) {
    if (this.department.id != null && this.department.id.toString().trim() !== '') {
      this.update();
    } else {
      this.insert();
    }
  }

insert() {
    this.departmentService.insert(this.department).subscribe({
      next: () => {
        this.router.navigate(['/employees/departments/']);
        this.messageService.add({
          severity: 'success',
          detail:
            'Cargo cadastrado com sucesso!. Para ativar a conta acesse o E-mail cadastrado',
        });
      },
    });
  }

  update() {
    this.departmentService.update(this.department).subscribe({
      next: () => {
        this.router.navigate(['/employees/departments/']);
        this.messageService.add({
          severity: 'success',
          detail: 'Cargo atualizado com sucesso!',
        });
      },
    });
  }

}
