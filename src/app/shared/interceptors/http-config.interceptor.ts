import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpEventType,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  csmApiList = ['master_data/fetchchannel'];
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const authReq = request.clone({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'in-auth-token': sessionStorage.getItem('in-auth-token') ?? '',
      }),
    });

    return next.handle(authReq).pipe(
      map((event) => {
        if (event.type === HttpEventType.Response) {
          const response = event.body;
          const headers = event.headers;

          if (headers) {
            const data = response;
            // Token Check
            if (event.headers.get('set-in-auth-token') !== null) {
              sessionStorage.setItem(
                'in-auth-token',
                event.headers.get('set-in-auth-token') ?? '',
              );
            }

            // API error handling on status
            if (data.status) {
              if (data.status == -114 || data.status == -106) {
                console.log('Session Expired logic');
              } else if (data.status == 0) {
                return event;
              } else {
                console.log('API Error:', data[`txt`]);
              }
            }
          }
          return event;
        }
        // Always return the event for non-Response types
        return event;
      }),
    );
  }
}
