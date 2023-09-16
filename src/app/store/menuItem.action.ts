import { createAction, props } from "@ngrx/store";
import { ItemList } from "../interface/interfaces";

export const retrieveMenuItems=createAction('retrieveMenuItems', props<{ value: ItemList}>())
export const resetMenuItem=createAction('[Menu Item] ')

