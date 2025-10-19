import { FilterModel } from "../../features/cocktails-list/types";
import { Cocktail } from "./cocktail.type";

export type BroadcastMessage = {
  type: 'favorites' | 'cocktails' | 'filters' | 'scroll-state';
  payload: Cocktail[] | FilterModel | number;
};
