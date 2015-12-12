/** Created by ge on 12/4/15. */
import {BehaviorSubject, Subject, Subscriber} from "rxjs";
import {combineReducers} from './util/combineReducers';
import {Action, Reducer, Hash} from "./interfaces";

const INIT_STORE = 'INIT_STORE';
export class Store<TState extends Hash> {
    public state$:BehaviorSubject<TState>;
    public rootReducer:Reducer;
    private dispatcher$:Subject<Action<TState>>;
    //private reporter:Subscriber<TState>;

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
        // BehaviorSubject should be a stream of states.
        this.dispatcher$ = new BehaviorSubject(initAction);
        this.state$ = new BehaviorSubject(initialState);
        var that = this;
        this.dispatcher$
            .subscribe(
                (action) => {
                    var currentState:TState = this.state$.getValue();
                    var state:TState = that.rootReducer(currentState, action, (state)=>this.state$.next(state));
                    if (typeof state !== "undefined") that.state$.next(state);
                },
                (error) => console.log('dispatcher$ error: ', error),
                () => console.log('dispatcher$ completed')
            )
    }

    dispatch(action:Action<TState>) {
        this.dispatcher$.next(action);
    }

    destroy =  ()=> {
        this.dispatcher$.complete();
        this.state$.complete();
    }
}
