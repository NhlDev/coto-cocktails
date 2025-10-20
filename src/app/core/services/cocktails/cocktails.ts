import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap, forkJoin, of, tap, catchError, EMPTY } from 'rxjs';
import { MatSnackBar, } from '@angular/material/snack-bar';

import { BaseHttpApi } from '../base-http-api';
import { Cocktail, CocktailResponse } from '../../types';
import { SyncTabs } from '../sync-tabs/sync-tabs';

@Injectable({ providedIn: 'root' })
export class Cocktails extends BaseHttpApi {

    private readonly syncService = inject(SyncTabs);
    private readonly snackCtrl = inject(MatSnackBar)

    searchByName(name: string): Observable<Cocktail[]> {
        return super.get<CocktailResponse>('search.php', { s: name })
            .pipe(
                catchError(err => this.handleErrors(err)),
                map(response => response.drinks || []),
                tap(cocktails => this.syncService.syncCocktails(cocktails)),
            );
    }

    searchByIngredient(ingredient: string): Observable<Cocktail[]> {
        return super.get<CocktailResponse>('filter.php', { i: ingredient })
            .pipe(
                catchError(err => this.handleErrors(err)),
                switchMap(response => {
                    const minimal = Array.isArray(response.drinks) ? response.drinks : [];
                    if (!minimal.length) return of([]);

                    // Para cada idDrink, pido el cocktail completo y lo reduzco a un array
                    return forkJoin(
                        minimal
                            .map(d => d.idDrink)
                            .filter((id): id is string => !!id)
                            .map(id =>
                                this.searchByID(+id).pipe(
                                    map(list => list[0])
                                )
                            )
                    ).pipe(
                        map(items => items.filter(Boolean) as Cocktail[]),
                        tap(cocktails => this.syncService.syncCocktails(cocktails)),
                    );
                })
            );
    }

    searchByID(id: number): Observable<Cocktail[]> {
        return super.get<CocktailResponse>('lookup.php', { i: id })
            .pipe(
                catchError(err => this.handleErrors(err)),
                map(response => response.drinks || []),
            );
    }

    private handleErrors(err: any) {
        this.snackCtrl.open(
            'Error al obtener los datos de los cócteles', 'Cerrar',
            { duration: 10000, verticalPosition: 'top', horizontalPosition: 'center', politeness: 'assertive' }
        );
        return EMPTY;
    }
}
