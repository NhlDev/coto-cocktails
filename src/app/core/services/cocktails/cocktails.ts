import { Injectable } from '@angular/core';

import { BaseApi } from '../base-api';

@Injectable({ providedIn: 'root' })
export class Cocktails extends BaseApi {

    searchByName(name: string) {
        return this.get<any>('search.php', { s: name });
    }

    searchByIngredient(ingredient: string) {
        return this.get<any>('search.php', { i: ingredient });
    }

    searchByID(id: string) {
        return this.get<any>('lookup.php', { i: id });
    }

}
