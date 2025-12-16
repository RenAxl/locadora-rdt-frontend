import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    OverlayPanelModule,
    
    RouterModule
  ],
    exports:[
    SidebarComponent,
    NavbarComponent
  ]
})
export class SharedModule { }
