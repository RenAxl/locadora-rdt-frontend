import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

import { ErrorHandlerService } from './error/services/error-handler.service';
import { JwtModule } from '@auth0/angular-jwt';
import { tokenGetter } from './auth/utils/token-getter';
import { API } from './config/api.config';
import { ErrorInterceptor } from './http/interceptors/error.interceptor';
import { NotAuthorizedComponent } from './pages/not-authorized/not-authorized.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';


@NgModule({
  imports: [
    CommonModule,
    ToastModule,
    ConfirmDialogModule,

    // AQUI O TOKEN É ADICIONADO NAS REQUISIÇÕES HTTP.
     JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:8080'],
        disallowedRoutes: [API.AUTH.TOKEN]
      }
    })
  ],
  exports: [
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    ErrorHandlerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  declarations: [
    NotAuthorizedComponent,
    PageNotFoundComponent
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule já foi carregado. Importe o CoreModule apenas no AppModule.'
      );
    }
  }
}