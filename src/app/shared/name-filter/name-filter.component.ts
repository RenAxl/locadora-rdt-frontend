import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-name-filter',
  templateUrl: './name-filter.component.html',
  styleUrls: ['./name-filter.component.css']
})
export class NameFilterComponent implements OnInit {

  @Input() text: string = '';
  @Input() nameFilter: string = '';
  @Output() search = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  searchName(){
    console.log("Filtro de pesquisa: " + this.nameFilter);
    this.search.emit(this.nameFilter);
  }

  formClear(){
    this.nameFilter = '';
    this.searchName();
  }

}
