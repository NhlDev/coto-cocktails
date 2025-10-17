import { Injectable } from '@angular/core';
import { map, Observable, switchMap, forkJoin, of } from 'rxjs';

import { BaseHttpApi } from '../base-http-api';
import { Cocktail, CocktailResponse } from '../../types';

@Injectable({ providedIn: 'root' })
export class Cocktails extends BaseHttpApi {

    searchByName(name: string): Observable<Cocktail[]> {
        return super.get<CocktailResponse>('search.php', { s: name })
            .pipe(
                map(response => response.drinks || [])
            );
    }

    searchByIngredient(ingredient: string): Observable<Cocktail[]> {
        return super.get<CocktailResponse>('filter.php', { i: ingredient })
            .pipe(
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
                    ).pipe(map(items => items.filter(Boolean) as Cocktail[]));
                })
            );
    }

    searchByID(id: number): Observable<Cocktail[]> {
        return super.get<CocktailResponse>('lookup.php', { i: id })
            .pipe(
                map(response => response.drinks || [])
            );
    }
}
