import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { NameFilterComponent } from './name-filter/name-filter.component';
import { MessageComponent } from './message/message.component';


@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    NameFilterComponent,
    MessageComponent
  ],
  imports: [
    CommonModule,
    OverlayPanelModule,
    FormsModule,
    
    RouterModule
  ],
    exports:[
    SidebarComponent,
    NavbarComponent, 
    NameFilterComponent,
    MessageComponent,
  ],
})
export class SharedModule { }
