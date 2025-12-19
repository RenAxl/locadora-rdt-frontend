import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  user: any = {
    profile: '' // importante começar vazio
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
