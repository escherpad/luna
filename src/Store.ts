/** Created by ge on 12/4/15. */
import {BehaviorSubject, Subject, Subscriber} from "rxjs";
import {combineReducers} from './util/combineReducers';
import {Action, Reducer, Hash} from "./interfaces";


const INIT_STORE = 'INIT_STORE';
export class Store<TState> {
    public state$:BehaviorSubject<TState>;
    public rootReducer:Reducer;
    public dispatcher$:Subject<Action<TState>>;

    constructor(rootReducer:Reducer,
                initialState?:TState,
                noMergeReducer:boolean = false) {

        if (!noMergeReducer && typeof rootReducer !== 'function') {
            this.rootReducer = combineReducers<TState>(rootReducer);
        } else {
            this.rootReducer = rootReducer;
        }

        var initAction:Action<TState> = {
            type: INIT_STORE,
            state: initialState
        };
        // dispatcher$ is a stream for action objects
        this.dispatcher$ = new BehaviorSubject(initAction);
        // state$ is a stream for the states of the store
        this.state$ = new BehaviorSubject(initialState);
        this.dispatcher$
            .subscribe(
                (action) => {
                    var currentState:TState = this.state$.getValue();
                    var state:TState = this.rootReducer(currentState, action, (state)=>this.state$.next(state));
                    if (typeof state !== "undefined") this.state$.next(state);
                },
                (error) => console.log('dispatcher$ error: ', error),
                () => console.log('dispatcher$ completed')
            )
    }

    dispatch(action:Action<TState>) {
        this.dispatcher$.next(action);
    }

    destroy = ()=> {
        this.dispatcher$.complete();
        this.state$.complete();
    }
}
