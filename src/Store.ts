/** Created by ge on 12/4/15. */
import {BehaviorSubject, ReplaySubject, Subject, Subscriber} from "rxjs";
import {combineReducers} from './util/combineReducers';
import {Action, Thunk, Reducer, Hash} from "./interfaces";


const INIT_STORE = 'INIT_STORE';
export class Store<TState> {
    public state$:BehaviorSubject<TState>;
    public rootReducer:Reducer;
    public action$:Subject<Action<TState>>;

    constructor(rootReducer:Reducer,
                initialState?:TState,
                noMergeReducer:boolean = false) {

        if (!noMergeReducer && typeof rootReducer !== 'function') {
            this.rootReducer = combineReducers<TState>(rootReducer);
        } else {
            this.rootReducer = rootReducer;
        }

        var initAction:Action<TState> = {type: INIT_STORE};
        if (initialState) initAction.state = initialState;

        // dispatcher$ is a stream for action objects
        this.action$ = new BehaviorSubject(initAction);
        // state$ is a stream for the states of the store
        this.state$ = new BehaviorSubject<TState>(undefined);
        this.action$
            .subscribe(
                (action) => {
                    var currentState:TState = this.state$.getValue();
                    var state:TState = this.rootReducer(currentState, action, (state)=>this.state$.next(state));
                    if (typeof state !== "undefined") this.state$.next(state);
                },
                (error) => console.log('dispatcher$ error: ', error),
                () => console.log('dispatcher$ completed')
            );

        if (typeof initialState !== "undefined") this.dispatch(initAction);
    }

    dispatch(action: Action<TState>|Thunk<TState>) {
        var _action: Action<TState>,
            _actionThunk: Thunk<TState>,
            newAction: Action<TState>;
        if (typeof action === 'function') {
            _actionThunk = action as Thunk<TState>;
            newAction = _actionThunk.apply(this);
            if (typeof newAction !== 'undefined') {
                return this.action$.next(newAction);
            }
        } else {
            _action = action as Action<TState>;
            if (_action.type === INIT_STORE && typeof _action.state !== "undefined") this.state$.next(_action.state);
            this.action$.next(_action);
        }
    }

    destroy = ()=> {
        this.action$.complete();
        this.state$.complete();
    }
}
