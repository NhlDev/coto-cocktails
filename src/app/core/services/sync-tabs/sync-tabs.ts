import { Injectable, OnDestroy, signal } from '@angular/core';

import { Cocktail } from '../../types';
import { BroadcastMessage } from '../../types/broadcast-message.type';
import { FilterModel } from '../../../features/cocktails-list/types';

const CHANNEL_NAME = 'sync-tabs-channel';

@Injectable({ providedIn: 'root' })
export class SyncTabs implements OnDestroy {
  private readonly channel: BroadcastChannel;

  // signals de los diferentes estados de la app
  favoritesSignal = signal<Cocktail[]>([])
  cocktailsSignal = signal<Cocktail[]>([])
  scrollStateSignal = signal<number>(0)
  filtersSignal = signal<FilterModel>({ filterBy: 'name', searchInput: '' })

  constructor() {
    this.channel = new BroadcastChannel(CHANNEL_NAME);
    this.channel.onmessage = this.handleMessage.bind(this);
  }

  ngOnDestroy(): void {
    this.channel.close();
  }

  syncFilters(filters: FilterModel): void {
    const message: BroadcastMessage = {
      type: 'filters',
      payload: filters
    };
    this.channel.postMessage(message);
  }

  syncCocktails(cocktails: Cocktail[]): void {
    const message: BroadcastMessage = {
      type: 'cocktails',
      payload: cocktails
    };
    this.channel.postMessage(message);
    console.log('Syncing cocktails:', cocktails);
  }

  syncScrollState(scrollPosition: number): void {
    const message: BroadcastMessage = {
      type: 'scroll-state',
      payload: scrollPosition
    };
    this.channel.postMessage(message);
    console.log('Syncing scroll position:', scrollPosition);
  }

  syncFavorites(favorites: Cocktail[]): void {
    const message: BroadcastMessage = {
      type: 'favorites',
      payload: favorites
    };
    this.channel.postMessage(message);
    console.log('Syncing favorites:', favorites);
  }

  private handleMessage(event: MessageEvent<BroadcastMessage>): void {
    const message = event.data;
    console.log('Received message:', message);
    // Handle the message based on its type
    switch (message.type) {
      case 'favorites':
        this.favoritesSignal.set(message.payload as Cocktail[]);
        break;
      case 'filters':
        this.filtersSignal.set(message.payload as FilterModel);
        break;
      case 'scroll-state':
        this.scrollStateSignal.set(message.payload as number);
        break;
      case 'cocktails':
        this.cocktailsSignal.set(message.payload as Cocktail[]);
        break;
    }
  }
}
