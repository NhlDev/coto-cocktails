import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BASE_API_URL } from './core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // uso este token para definir la URL de la API. Lo dejo harcodeado por simplicidad, pero en una app real podría venir de una variable de entorno, un archivo environment o similar
    { provide: BASE_API_URL, useValue: 'https://www.thecocktaildb.com/api/json/v1/1/' },
  ]
};
