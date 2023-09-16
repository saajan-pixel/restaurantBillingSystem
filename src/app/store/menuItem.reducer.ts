import { Action, createReducer, on } from '@ngrx/store';
import { initialState } from './menuItem.state';
import { resetMenuItem, retrieveMenuItems } from './menuItem.action';

const _retrieveMenuItemsReducer = createReducer(
  initialState,
  on(retrieveMenuItems, (state, { value }) => {
    return { ...state, menuItem: value };
  }),
  on(resetMenuItem,()=> initialState)
);

export const retrieveMenuItemsReducer = (state:any, action: Action) => {
  return _retrieveMenuItemsReducer(state, action);
};
