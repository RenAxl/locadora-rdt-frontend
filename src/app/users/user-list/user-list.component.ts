import { Component, OnInit, ViewChild } from '@angular/core';

import { UsersService } from '../users.service';
import { User } from 'src/app/core/models/User';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];

   @ViewChild('userTable') grid!: Table;

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.list();
  }

    list(): void {
    
    this.userService
      .list()
      .subscribe((data) => {
        console.log(data);
        this.users = data;
      });
  }

}
