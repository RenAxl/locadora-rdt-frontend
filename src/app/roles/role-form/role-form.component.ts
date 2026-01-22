import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/core/models/Role';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.css']
})
export class RoleFormComponent implements OnInit {

  role: Role = new Role();

  constructor() { }

  ngOnInit(): void {
  }

}
