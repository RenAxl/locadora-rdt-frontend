import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/User';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  user: User = {
    profile: '' // começa vazio
  };

  profiles = [
    { label: 'Administrador', value: 'ADMINISTRADOR' },
    { label: 'Gerente', value: 'GERENTE' },
    { label: 'Atendente', value: 'ATENDENTE' },
    { label: 'Financeiro', value: 'FINANCEIRO' },
    { label: 'Cliente', value: 'CLIENTE' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
