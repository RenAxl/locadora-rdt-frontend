import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/core/models/User';
import { UsersService } from '../users.service';
import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  user: User = {
    profile: '', // começa vazio
  };

  profiles = [
    { label: 'Administrador', value: 'ADMINISTRADOR' },
    { label: 'Gerente', value: 'GERENTE' },
    { label: 'Atendente', value: 'ATENDENTE' },
    { label: 'Financeiro', value: 'FINANCEIRO' },
    { label: 'Cliente', value: 'CLIENTE' },
  ];

  constructor(
    private userService: UsersService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('userId');

    if (id != null) {
      this.userService.findById(id).subscribe((data) => {
        this.user = data;
      });
    }
  }

  save(form: NgForm) {
    if (this.user.id != null && this.user.id.toString().trim() != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  insert() {
    this.userService.insert(this.user).subscribe(
      () => {
        this.router.navigate(['/users/']);
        this.messageService.add({
          severity: 'success',
          detail: 'Usuário cadastrado com sucesso!',
        });
      },
      (error) => this.errorHandler.handle(error)
    );
  }

  update() {
    this.userService.update(this.user).subscribe(
      () => {
        this.router.navigate(['/users/']);
        this.messageService.add({
          severity: 'success',
          detail: 'Usuário cadastrado com sucesso!',
        });
      },
      (error) => this.errorHandler.handle(error)
    );
  }
}
