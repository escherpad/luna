/** Created by ge on 12/4/15. */
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { Action, Thunk, Reducer, Hash } from "./interfaces";
export declare class Store<TState> extends BehaviorSubject<TState> {
    rootReducer: Reducer;
    action$: Subject<Action>;
    constructor(rootReducer: Reducer | Hash<Reducer>, initialState: TState);
    dispatch(action: Action | Thunk<TState>): void;
    getState: () => TState;
    select: <TRState>(key: string) => Observable<TRState>;
    destroy: () => void;
}
