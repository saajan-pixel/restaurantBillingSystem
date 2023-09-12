import { createAction, props } from "@ngrx/store";

export const retrieveMenuItems=createAction('retrieveMenuItems', props<{ value: any}>())

