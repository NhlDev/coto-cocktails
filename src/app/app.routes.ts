import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'cocktails',
        loadComponent: () => import('./features/cocktails-list/pages/cocktails-list/cocktails-list').then(m => m.CocktailsList)
    },
    {
        path: 'cocktail/:id',
        loadComponent: () => import('./features/cocktail-details/pages/cocktail-details/cocktail-details').then(m => m.CocktailDetails)
    },
    {
        path: '',
        redirectTo: 'cocktails',
        pathMatch: 'full'
    },
];
