import { createReducer, on } from '@ngrx/store';
import { initialState } from './menuItem.state';
import { retrieveMenuItems } from './menuItem.action';

const _retrieveMenuItemsReducer = createReducer(
  initialState,
  on(retrieveMenuItems, (state, { value }) => {
    return { ...state, menuItem: value };
  })
);

export const retrieveMenuItemsReducer = (state: any, action: any) => {
  return _retrieveMenuItemsReducer(state, action);
};
