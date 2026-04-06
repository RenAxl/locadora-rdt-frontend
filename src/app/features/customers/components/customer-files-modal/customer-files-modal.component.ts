import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-customer-files-modal',
  templateUrl: './customer-files-modal.component.html',
  styleUrls: ['./customer-files-modal.component.css'],
})
export class CustomerFilesModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() customerId?: number;
  @Input() customerName?: string;

  constructor() {}

  ngOnInit(): void {}

  close(): void {
    this.visibleChange.emit(false);
  }
  
}
