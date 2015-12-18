/** Created by ge on 12/17/15. */
import {Reducer} from "./interfaces";
import {Store} from "./Store";
export function createStore <TState>(reducer:Reducer, initialState:TState):Store<TState> {
    return new Store(reducer, initialState);
}
