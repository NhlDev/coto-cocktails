import { InjectionToken } from '@angular/core';

export const BASE_API_URL = new InjectionToken<string>('BASE_API_URL');
export const FAVORITE_STORAGE = new InjectionToken<Storage>('FAVORITE_STORAGE');