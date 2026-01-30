import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import localePl from '@angular/common/locales/pl';
import { registerLocaleData } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';

registerLocaleData(localePl)

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimations(), 
    { provide: LOCALE_ID, useValue: 'pl-PL'},
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL'},
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
