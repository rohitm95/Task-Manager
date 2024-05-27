import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TodoState } from "./reducers";

export const getTodosState = createFeatureSelector<TodoState>('todo');

export const getAvailableTodos = createSelector(getTodosState, (state: TodoState) => state.todos);