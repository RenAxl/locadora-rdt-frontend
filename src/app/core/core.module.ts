import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ErrorHandlerService } from './error-handler.service';




@NgModule({
  imports: [
    CommonModule,
    
    ToastModule,
    ConfirmDialogModule
  ],
  exports: [
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [
    MessageService,
    ErrorHandlerService,
    ConfirmationService
  ]
})
export class CoreModule {}
