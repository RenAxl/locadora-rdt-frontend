import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users = [
    {
      id: 1,
      name: 'Renan Duarte',
      email: 'renan.duarte@locagames.com',
      photo: 'assets/images/sem-foto.jpg',
      roles: [
        { authority: 'ADMIN' }
      ]
    },
    {
      id: 2,
      name: 'Larissa Menezes',
      email: 'larissa.menezes@locagames.com',
      photo: 'assets/images/sem-foto.jpg',
      roles: [
        { authority: 'ATENDENTE' }
      ]
    },
    {
      id: 3,
      name: 'João Pedro Silva',
      email: 'joao.pedro@locagames.com',
      photo: 'assets/images/sem-foto.jpg',
      roles: [
        { authority: 'OPERADOR' }
      ]
    },
    {
      id: 4,
      name: 'Ana Martins',
      email: 'ana.martins@locagames.com',
      photo: 'assets/images/sem-foto.jpg',
      roles: [
        { authority: 'GERENTE' }
      ]
    },
    {
      id: 5,
      name: 'Bruno Rocha',
      email: 'bruno.rocha@locagames.com',
      photo: 'assets/images/sem-foto.jpg',
      roles: [
        { authority: 'CAIXA' }
      ]
    }
  ];


  constructor() { }

  ngOnInit(): void {
  }

}
