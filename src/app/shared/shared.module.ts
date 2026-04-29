import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { NameFilterComponent } from './components/name-filter/name-filter.component';
import { MessageComponent } from './components/message/message.component';
import { NgxMaskModule } from 'ngx-mask';



@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    NameFilterComponent,
    MessageComponent,
  ],
  imports: [
    CommonModule,
    OverlayPanelModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    
    RouterModule
  ],
    exports:[
    SidebarComponent,
    NavbarComponent, 
    NameFilterComponent,
    MessageComponent,
    NgxMaskModule,
  ],
})
export class SharedModule { }
