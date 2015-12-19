/** Created by ge on 12/4/15. */
import {Subject, BehaviorSubject, Observable} from 'rxjs';
import {passOrCombineReducers} from './util/combineReducers';
import {Action, Thunk, Reducer, Hash} from "./interfaces";


const INIT_STORE = 'INIT_STORE';
export class Store<TState> extends BehaviorSubject<TState> {
    public rootReducer:Reducer;
    public action$:Subject<Action>;

    constructor(rootReducer:Reducer | Hash<Reducer>,
                initialState:TState) {
        // this is a stream for the states of the store, call BehaviorSubject constructor
        super(passOrCombineReducers(rootReducer)(initialState, {type: INIT_STORE}));
        this.rootReducer = passOrCombineReducers(rootReducer);

        // action$ is a stream for action objects
        this.action$ = new Subject();
        this.action$
            .subscribe(
                (action) => {
                    var currentState:TState = this.getValue();
                    var state:TState = this.rootReducer(currentState, action);
                    if (typeof state !== "undefined") this.next(state);
                },
                (error) => console.log('dispatcher$ Error: ', error.toString()),
                () => console.log('dispatcher$ completed')
            );

    }

    dispatch(action:Action|Thunk<TState>) {
        var _action:Action,
            _actionThunk:Thunk<TState>,
            newAction:Action;
        if (typeof action === 'function') {
            _actionThunk = action as Thunk<TState>;
            newAction = _actionThunk.apply(this);
            if (typeof newAction !== 'undefined') {
                return this.action$.next(newAction);
            }
        } else {
            _action = action as Action;
            this.action$.next(_action);
        }
    }

    select = <TRState>(key:string):Observable<TRState> => {
        return this
            .map((state:any) => {
                var rState:TRState = state[key] as TRState;
                return rState;
            });
    };

    destroy = ()=> {
        this.action$.complete();
        this.complete();
    }
}
