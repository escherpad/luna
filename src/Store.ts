/** Created by ge on 12/4/15. */
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber'
import {combineReducers} from './util/combineReducers';
import {Action, Thunk, Reducer, Hash} from "./interfaces";


const INIT_STORE = 'INIT_STORE';
export class Store<TState> extends BehaviorSubject<TState> {
    public rootReducer:Reducer;
    public action$:Subject<Action<TState>>;

    constructor(rootReducer:Reducer | Hash<Reducer>,
                initialState?:TState,
                noMergeReducer:boolean = false) {
        // this is a stream for the states of the store, call BehaviorSubject constructor
        super(undefined);

        if (typeof rootReducer !== 'function' && !noMergeReducer) {
            this.rootReducer = combineReducers<TState>(rootReducer as Hash<Reducer>);
        } else {
            this.rootReducer = rootReducer as Reducer;
        }

        var initAction:Action<TState> = {type: INIT_STORE};
        if (initialState) initAction.state = initialState;

        // dispatcher$ is a stream for action objects
        this.action$ = new BehaviorSubject(initAction);

        this.action$
            .subscribe(
                (action) => {
                    var currentState:TState = this.getValue();
                    var state:TState = this.rootReducer(currentState, action, (state)=>this.next(state));
                    if (typeof state !== "undefined") this.next(state);
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
            if (_action.type === INIT_STORE && typeof _action.state !== "undefined") this.next(_action.state);
            this.action$.next(_action);
        }
    }

    select<TRState>(key: string): Observable<TRState> {
        return this
            .map((state:any) => {
                var rState:TRState = state[key] as TRState;
                return rState;
            })
            .distinctUntilChanged();
    }

    destroy = ()=> {
        this.action$.complete();
        this.complete();
    }
}
