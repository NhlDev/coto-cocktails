import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

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
        return super.get<CocktailResponse>('search.php', { i: ingredient })
            .pipe(
                map(response => response.drinks || [])
            );
    }

    searchByID(id: number): Observable<Cocktail[]> {
        return super.get<CocktailResponse>('lookup.php', { i: id })
            .pipe(
                map(response => response.drinks || [])
            );
    }
}
