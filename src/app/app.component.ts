import { Component } from '@angular/core';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  users: User[] = [];

  ngOnInit(): void {
    this.users = [
      { id: 1, name: 'Renan', email: 'renan@example.com', role: 'Admin' },
      { id: 2, name: 'Maria', email: 'maria@example.com', role: 'User' },
      { id: 3, name: 'João', email: 'joao@example.com', role: 'User' }
    ];
  }
}

