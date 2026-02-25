import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../../error/services/error-handler.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorHandler: ErrorHandlerService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          const isPhotoEndpoint = req.url.includes('/users/me/photo');
          const isNotFound = error.status === 404;

          // Não mostra mensagem de erro se não tiver foto
          if (isPhotoEndpoint && isNotFound) {
            return EMPTY;
          }

          this.errorHandler.handle(error);
          return throwError(() => error);
        }

        this.errorHandler.handle('Erro inesperado ao processar a requisição.');
        return throwError(() => error);
      })
    );
  }
}