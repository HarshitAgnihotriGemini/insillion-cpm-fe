import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { provideToastr } from 'ngx-toastr';
import { HttpConfigInterceptor } from './shared/interceptors/http-config.interceptor';
import { provideNgxMask } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner'


export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(NgxSpinnerModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideNgxMask(),
    provideRouter(routes, withHashLocation()),
    provideAnimations(),
    importProvidersFrom(ModalModule.forRoot()),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
    }),
  ],
};
