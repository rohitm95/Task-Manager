import { Action, ActionReducer } from "@ngrx/store";
import { TodoState, todoReducer } from "./reducers";

export interface AppState {
    todo: TodoState
}

export interface AppStore {
    todo: ActionReducer<TodoState, Action>;
}

export const appStore: AppStore = {
    todo: todoReducer
}
