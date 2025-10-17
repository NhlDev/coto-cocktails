import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: 'cocktails',
    loadComponent: () => import('./features/cocktails-list/pages/cocktails-list/cocktails-list').then(m => m.CocktailsList)
}, {
    path: '',
    redirectTo: 'cocktails',
    pathMatch: 'full'
}];
